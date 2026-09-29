"use server";

import { redirect } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";
import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
} from "@/lib/types";

export type ReceiptData = {
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  transaction_date: string;
};

const MODEL_CANDIDATES = [
  "gemini-3.8-flash",
];

async function withRetry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  baseDelayMs = 1500
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      const msg = e instanceof Error ? e.message : String(e);
      const retryable =
        msg.includes("503") ||
        msg.includes("high demand") ||
        msg.includes("429");
      if (!retryable || i === attempts - 1) throw e;
      await new Promise((r) => setTimeout(r, baseDelayMs * (i + 1)));
    }
  }
  throw lastError;
}

export async function scanReceipt(
  base64Image: string,
  mimeType: string
): Promise<ReceiptData> {
  if (typeof base64Image !== "string" || typeof mimeType !== "string") {
    throw new Error("Invalid receipt image.");
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
  if (base64Image.length > 7_000_000) {
    throw new Error("Image must be smaller than 5MB.");
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(mimeType)) {
    throw new Error("Please upload a JPG, PNG, or WEBP image.");
  }

  const prompt = `You are a receipt scanner AI. Extract transaction details from this receipt image.

Return ONLY JSON:
{
  "type": "expense",
  "amount": 45.99,
  "category": "Food",
  "description": "Lunch at Pizza Hut",
  "transaction_date": "2025-09-27"
}

Rules:
- "type": usually "expense". "income" only for refunds.
- "amount": final total in PKR (number only, no "Rs." or "PKR").
- "category" MUST be one of:
  EXPENSE: ${EXPENSE_CATEGORIES.join(", ")}
  INCOME: ${INCOME_CATEGORIES.join(", ")}
- "description": short summary like "Lunch at Pizza Hut".
- "transaction_date": YYYY-MM-DD. Use today if unclear.

Return ONLY JSON.`;

  const genAI = new GoogleGenerativeAI(apiKey);

  let text: string | null = null;
  let lastError: Error | null = null;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { responseMimeType: "application/json" },
      });
      const result = await withRetry(async () =>
        model.generateContent([
          prompt,
          { inlineData: { data: base64Image, mimeType } },
        ])
      );
      text = result.response.text().trim();
      break;
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      continue;
    }
  }

  if (!text) {
    const msg = lastError?.message || "";
    if (msg.includes("429") || msg.includes("quota") || msg.includes("Too Many")) {
      throw new Error(
        "AI limit reached for today. Try again later or use manual entry."
      );
    }
    if (msg.includes("503") || msg.includes("high demand")) {
      throw new Error(
        "AI is very busy right now. Please try again in a moment."
      );
    }
    if (msg.includes("404") || msg.includes("NOT_FOUND")) {
      throw new Error("Receipt AI model is unavailable. Check Gemini model access.");
    }
    if (msg.includes("API_KEY_INVALID") || msg.includes("403")) {
      throw new Error("Gemini rejected the API key. Check GEMINI_API_KEY.");
    }
    throw new Error("Receipt scan failed. Try a clearer image or manual entry.");
  }

  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  let parsed: ReceiptData;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("AI returned invalid data. Please try a clearer image.");
  }

  if (!Number.isFinite(Number(parsed.amount)) || Number(parsed.amount) <= 0) {
    throw new Error("Could not detect amount on the receipt.");
  }
  if (parsed.type !== "income" && parsed.type !== "expense") {
    parsed.type = "expense";
  }
  const allowedCategories =
    parsed.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  if (!allowedCategories.includes(parsed.category)) {
    throw new Error("AI returned an unsupported receipt category.");
  }
  if (typeof parsed.description !== "string") {
    throw new Error("AI returned an invalid receipt description.");
  }
  if (!parsed.transaction_date) {
    parsed.transaction_date = new Date().toISOString().split("T")[0];
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(parsed.transaction_date)) {
    throw new Error("AI returned an invalid receipt date.");
  }

  parsed.amount = Number(parsed.amount);
  return parsed;
}