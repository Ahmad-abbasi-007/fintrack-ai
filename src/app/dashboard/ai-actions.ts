"use server";

import { redirect } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";
import type { Transaction } from "@/lib/types";

export type Insight = {
  title: string;
  description: string;
  type: "warning" | "success" | "tip";
};

const MODEL_CANDIDATES = [
  "gemini-3.8-flash",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-flash-latest",
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
      const isRetryable = msg.includes("503") || msg.includes("high demand");
      if (!isRetryable || i === attempts - 1) throw e;
      await new Promise((r) => setTimeout(r, baseDelayMs * (i + 1)));
    }
  }
  throw lastError;
}

export async function generateInsights(): Promise<Insight[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .order("transaction_date", { ascending: false })
    .limit(100);

  const list = (transactions ?? []) as Transaction[];

  if (list.length < 3) {
    return [
      {
        title: "Not enough data yet",
        description:
          "Add at least 3 transactions to get personalized AI insights.",
        type: "tip",
      },
    ];
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const summary = list.map((t) => ({
    type: t.type,
    amount: Number(t.amount),
    category: t.category,
    date: t.transaction_date,
    description: t.description || "",
  }));

  const prompt = `You are a personal finance advisor AI.

Analyze these transactions and return EXACTLY 4 insights.

Return ONLY a JSON object (no markdown, no explanation):

{
  "insights": [
    { "title": "Short headline (max 8 words)", "description": "One-sentence advice with real numbers (max 25 words)", "type": "warning" },
    { "title": "...", "description": "...", "type": "success" },
    { "title": "...", "description": "...", "type": "tip" },
    { "title": "...", "description": "...", "type": "warning" }
  ]
}

Rules:
- Use ACTUAL amounts and categories from the data.
- "warning" = overspending or risk
- "success" = good habit observed
- "tip" = actionable advice
- Be specific, not generic.
- Return ONLY JSON.

Transactions:
${JSON.stringify(summary)}`;

  const genAI = new GoogleGenerativeAI(apiKey);

  let text: string | null = null;
  let lastError: Error | null = null;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json",
        },
      });

      const result = await withRetry(async () =>
        model.generateContent(prompt)
      );

      text = result.response.text().trim();
      break;
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      continue;
    }
  }

  if (!text) {
    throw new Error(
      `All Gemini models are busy right now. Please try again in a minute. (${
        lastError?.message || "unknown error"
      })`
    );
  }

  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    return (parsed.insights as Insight[]) ?? [];
  } catch {
    throw new Error("Failed to parse AI response");
  }
}