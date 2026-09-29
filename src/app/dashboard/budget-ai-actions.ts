"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { callGroqJson } from "@/lib/ai/groq";
import type { Transaction } from "@/lib/types";

export type BudgetSuggestion = {
  category: string;
  suggested_limit: number;
  reason: string;
};

export async function suggestBudgets(): Promise<BudgetSuggestion[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .eq("type", "expense")
    .gte("transaction_date", threeMonthsAgo.toISOString().split("T")[0]);
  if (error) throw new Error("Could not load spending history for AI budgets.");

  const list = (transactions ?? []) as Transaction[];

  if (list.length < 5) return [];

  const totals: Record<string, number> = {};
  list.forEach((t) => {
    totals[t.category] = (totals[t.category] || 0) + Number(t.amount);
  });

  const summary = Object.entries(totals).map(([category, total]) => ({
    category,
    total_3_months: Number(total.toFixed(2)),
    avg_monthly: Number((total / 3).toFixed(2)),
    transactions: list.filter((t) => t.category === category).length,
  }));

  const prompt = `You are a personal finance advisor AI.

Given the user's spending summary from the last 3 months, suggest a realistic MONTHLY BUDGET per category.

Rules:
- Aim for ~10% less than their average where they overspend.
- Never below 70% of their average.
- Include up to 6 categories with the highest totals.
- suggested_limit must be a NUMBER (no currency symbol).
- reason is ONE sentence with real numbers.

Return ONLY JSON in this exact format:
{
  "suggestions": [
    { "category": "Food", "suggested_limit": 450, "reason": "You averaged 500/month; a 450 limit saves 50/mo." }
  ]
}

Spending summary:
${JSON.stringify(summary)}`;

  const parsed = await callGroqJson(prompt, 0.5);
  if (!parsed || typeof parsed !== "object" || !("suggestions" in parsed)) {
    throw new Error("AI returned an invalid budget response.");
  }

  const rows = (parsed as { suggestions: unknown }).suggestions;
  if (!Array.isArray(rows)) {
    throw new Error("AI returned an invalid budget response.");
  }

  return rows.flatMap((row): BudgetSuggestion[] => {
    if (!row || typeof row !== "object") return [];
    const item = row as Record<string, unknown>;
    const category = typeof item.category === "string" ? item.category.trim() : "";
    const suggestedLimit = Number(item.suggested_limit);
    const reason = typeof item.reason === "string" ? item.reason.trim() : "";
    if (
      !summary.some((entry) => entry.category === category) ||
      !Number.isFinite(suggestedLimit) ||
      suggestedLimit <= 0 ||
      !reason
    ) {
      return [];
    }
    return [{ category, suggested_limit: suggestedLimit, reason }];
  }).slice(0, 6);
}

export async function applyBudgetSuggestions(
  suggestions: BudgetSuggestion[]
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!Array.isArray(suggestions) || suggestions.length > 6) {
    throw new Error("Invalid budget suggestions.");
  }
  if (suggestions.length === 0) return;

  const { data: transactions, error: transactionError } = await supabase
    .from("transactions")
    .select("category")
    .eq("user_id", user.id)
    .eq("type", "expense");

  if (transactionError) throw new Error(transactionError.message);
  const allowedCategories = new Set((transactions ?? []).map((row) => row.category));
  const seenCategories = new Set<string>();

  const rows = suggestions.map((suggestion) => {
    if (
      !suggestion ||
      typeof suggestion.category !== "string" ||
      !allowedCategories.has(suggestion.category) ||
      seenCategories.has(suggestion.category) ||
      !Number.isFinite(suggestion.suggested_limit) ||
      suggestion.suggested_limit <= 0
    ) {
      throw new Error("Invalid budget suggestion. Generate the suggestions again.");
    }
    seenCategories.add(suggestion.category);
    return {
      user_id: user.id,
      category: suggestion.category,
      monthly_limit: suggestion.suggested_limit,
      updated_at: new Date().toISOString(),
    };
  });

  const { error } = await supabase
    .from("budgets")
    .upsert(rows, { onConflict: "user_id,category" });

  if (error) throw new Error(error.message);
}