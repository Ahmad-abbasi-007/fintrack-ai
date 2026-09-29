"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { callGroqJson } from "@/lib/ai/groq";

export async function suggestCategory(
  description: string,
  type: "income" | "expense"
): Promise<string | null> {
  if (type !== "income" && type !== "expense") {
    throw new Error("Invalid transaction type.");
  }
  const normalizedDescription = description.trim().slice(0, 500);
  if (!normalizedDescription) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: cats, error } = await supabase
    .from("categories")
    .select("name")
    .eq("user_id", user.id)
    .eq("type", type);
  if (error) throw new Error("Could not load categories for AI matching.");

  const categoryNames = (cats ?? []).map((c) => c.name);
  if (categoryNames.length === 0) return null;

  const prompt = `You categorize financial transactions.

Pick the BEST matching category from this list for the given description:

Available categories (choose one exact name): ${JSON.stringify(categoryNames)}

Return ONLY JSON:
{ "category": "Food" }

Rules:
- category MUST be exactly one from the list.
- If nothing fits, return { "category": null }.
- Return ONLY JSON.

Description: ${JSON.stringify(normalizedDescription)}`;

  const parsed = await callGroqJson(prompt, 0.2);
  if (!parsed || typeof parsed !== "object" || !("category" in parsed)) {
    return null;
  }
  const category = (parsed as { category: unknown }).category;
  return typeof category === "string" && categoryNames.includes(category.trim())
    ? category.trim()
    : null;
}