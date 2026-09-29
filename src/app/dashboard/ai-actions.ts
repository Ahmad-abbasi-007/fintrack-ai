"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { callGroqJson } from "@/lib/ai/groq";
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

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("transaction_date", { ascending: false })
    .limit(100);
  if (error) throw new Error("Could not load transactions for AI insights.");

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

  const summary = list.map((t) => ({
    type: t.type,
    amount: Number(t.amount),
    category: t.category,
    date: t.transaction_date,
    description: t.description || "",
  }));

  const prompt = `You are a personal finance advisor AI.

Analyze these transactions and return EXACTLY 4 insights.

Return ONLY JSON:
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

Transactions:
${JSON.stringify(summary)}`;

  const parsed = await callGroqJson(prompt, 0.7);
  if (!parsed || typeof parsed !== "object" || !("insights" in parsed)) {
    throw new Error("AI returned an invalid insights response.");
  }

  const rows = (parsed as { insights: unknown }).insights;
  if (!Array.isArray(rows)) {
    throw new Error("AI returned an invalid insights response.");
  }

  const insights = rows.flatMap((row): Insight[] => {
    if (!row || typeof row !== "object") return [];
    const item = row as Record<string, unknown>;
    if (
      typeof item.title !== "string" ||
      !item.title.trim() ||
      typeof item.description !== "string" ||
      !item.description.trim() ||
      (item.type !== "warning" &&
        item.type !== "success" &&
        item.type !== "tip")
    ) {
      return [];
    }
    return [
      {
        title: item.title.trim(),
        description: item.description.trim(),
        type: item.type,
      },
    ];
  });

  if (insights.length === 0) {
    throw new Error("AI did not return any usable insights.");
  }
  return insights.slice(0, 4);
}