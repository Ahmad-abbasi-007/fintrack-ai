"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Transaction } from "@/lib/types";

export type Insight = {
  title: string;
  description: string;
  type: "warning" | "success" | "tip";
};

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

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  // Compact summary to send to AI (not raw list, to keep tokens low)
  const summary = list.map((t) => ({
    type: t.type,
    amount: Number(t.amount),
    category: t.category,
    date: t.transaction_date,
    description: t.description || "",
  }));

  const systemPrompt = `You are a personal finance advisor AI.
You will receive a list of a user's transactions as JSON.
Analyze them and return EXACTLY 4 insights in this JSON format:

{
  "insights": [
    {
      "title": "Short headline (max 8 words)",
      "description": "One-sentence specific advice with real numbers from the data (max 25 words)",
      "type": "warning" | "success" | "tip"
    }
  ]
}

Rules:
- Use actual amounts and categories from the data.
- "warning" = overspending or risk
- "success" = good habit observed
- "tip" = actionable advice
- Be specific, not generic.
- Return ONLY the JSON, no markdown, no explanation.`;

  const userPrompt = `Here are my transactions:\n${JSON.stringify(
    summary
  )}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error: ${err}`);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content || "{}";

  try {
    const parsed = JSON.parse(content);
    return (parsed.insights as Insight[]) ?? [];
  } catch {
    throw new Error("Failed to parse AI response");
  }
}