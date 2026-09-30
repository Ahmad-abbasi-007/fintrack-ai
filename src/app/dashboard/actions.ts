"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function addTransaction(formData: FormData) {
  const supabase = await createClient();

  const account_id = (formData.get("account_id") as string) || null;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const type = formData.get("type") as "income" | "expense";
  const amount = parseFloat(formData.get("amount") as string);
  const category = formData.get("category") as string;
  const description = (formData.get("description") as string) || null;
  const transaction_date = formData.get("transaction_date") as string;

  if (!type || !amount || !category || !transaction_date) {
    throw new Error("All required fields must be filled");
  }

   const is_recurring = formData.get("is_recurring") === "on";
  const recurrence = (formData.get("recurrence") as string) || null;

  // Calculate next_occurrence if recurring
  let next_occurrence: string | null = null;
  if (is_recurring && recurrence) {
    const d = new Date(transaction_date);
    if (recurrence === "weekly") d.setDate(d.getDate() + 7);
    else if (recurrence === "monthly") d.setMonth(d.getMonth() + 1);
    else if (recurrence === "yearly") d.setFullYear(d.getFullYear() + 1);
    next_occurrence = d.toISOString().split("T")[0];
  }

  const { error } = await supabase.from("transactions").insert({
    user_id: user.id,
    type,
    amount,
    category,
    description,
    transaction_date,
    is_recurring,
    recurrence: is_recurring ? recurrence : null,
    next_occurrence,
    account_id,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}

export async function deleteTransaction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const id = formData.get("id") as string;

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}