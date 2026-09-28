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
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-flash-latest",
];

// Helper: retry a function on 503 errors with exponential backoff
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
      const isRetryable = msg.includes("503") || msg.includes("high demand");

      if (!isRetryable || i === attempts - 1) throw e;

      // Exponential backoff: 1.5s, 3s, 4.5s
      await new Promise((r) => setTimeout(r, baseDelayMs * (i + 1)));
    }
  }
  throw lastError;
}

export async function scanReceipt(
  base64Image: string,
  mimeType: string
): Promise<ReceiptData> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const prompt = `You are a receipt scanner AI. Analyze this receipt image and extract the transaction details.

Return ONLY a JSON object with this exact structure (no markdown, no explanation):

{
  "type": "expense",
  "amount": 45.99,
  "category": "Food",
  "description": "Lunch at Pizza Hut",
  "transaction_date": "2025-09-27"
}

Rules:
- "type" is almost always "expense" for receipts. Use "income" only if the receipt clearly shows a refund or deposit.
- "amount" is the FINAL total in PKR (Pakistani Rupees), after tax/tip. Return only the number, with no currency symbol.
- Pakistani receipts may show "Rs." or "PKR" before the amount; strip that prefix and return only the numeric value.
- "category" MUST be exactly one of these:
  EXPENSE: ${EXPENSE_CATEGORIES.join(", ")}
  INCOME: ${INCOME_CATEGORIES.join(", ")}
  If unsure, use "Other".
- "description" is a short one-line summary (e.g. "Lunch at Pizza Hut", "Gas at Shell").
- "transaction_date" must be in YYYY-MM-DD format. If unclear, use today's date.

Return ONLY the JSON.`;

  const genAI = new GoogleGenerativeAI(apiKey);

  // Try each model with retry
  let text: string | null = null;
  let lastError: Error | null = null;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await withRetry(async () =>
        model.generateContent([
          prompt,
          {
            inlineData: {
              data: base64Image,
              mimeType,
            },
          },
        ])
      );

      text = result.response.text().trim();
      break; // success
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      continue; // try next model
    }
  }

  if (!text) {
    throw new Error(
      `All Gemini models are busy right now. Please try again in a minute. (${
        lastError?.message || "unknown error"
      })`
    );
  }

  // Strip markdown fences just in case
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

  if (!parsed.amount || isNaN(Number(parsed.amount))) {
    throw new Error("Could not detect amount on the receipt.");
  }
  if (parsed.type !== "income" && parsed.type !== "expense") {
    parsed.type = "expense";
  }
  if (!parsed.transaction_date) {
    parsed.transaction_date = new Date().toISOString().split("T")[0];
  }

  parsed.amount = Number(parsed.amount);

  return parsed;
}