"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function upsertBudget(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const category = formData.get("category") as string;
  const monthly_limit = parseFloat(formData.get("monthly_limit") as string);

  if (!category || !monthly_limit || monthly_limit <= 0) {
    throw new Error("Category and a positive limit are required.");
  }

  // Upsert — because of the unique(user_id, category) constraint
  const { error } = await supabase.from("budgets").upsert(
    {
      user_id: user.id,
      category,
      monthly_limit,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,category" }
  );

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/budgets");
}

export async function deleteBudget(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const id = formData.get("id") as string;

  const { error } = await supabase
    .from("budgets")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/budgets");
}