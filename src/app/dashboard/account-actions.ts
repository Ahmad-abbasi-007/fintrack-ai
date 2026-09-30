"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function addAccount(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = (formData.get("name") as string)?.trim();
  const type = formData.get("type") as string;
  const initial_balance =
    parseFloat(formData.get("initial_balance") as string) || 0;
  const icon = (formData.get("icon") as string) || "💳";
  const color = (formData.get("color") as string) || "emerald";

  if (!name || !type) throw new Error("Name and type are required.");

  const { error } = await supabase.from("accounts").insert({
    user_id: user.id,
    name,
    type,
    initial_balance,
    icon,
    color,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/accounts");
  revalidatePath("/dashboard");
}

export async function updateAccount(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim();
  const type = formData.get("type") as string;
  const initial_balance =
    parseFloat(formData.get("initial_balance") as string) || 0;
  const icon = (formData.get("icon") as string) || "💳";
  const color = (formData.get("color") as string) || "emerald";

  if (!name || !type) throw new Error("Name and type are required.");

  const { error } = await supabase
    .from("accounts")
    .update({
      name,
      type,
      initial_balance,
      icon,
      color,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/accounts");
  revalidatePath("/dashboard");
}

export async function deleteAccount(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const id = formData.get("id") as string;

  // Prevent deleting last remaining account
  const { count } = await supabase
    .from("accounts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if ((count ?? 0) <= 1) {
    throw new Error(
      "You must have at least one account. Create another before deleting this one."
    );
  }

  const { error } = await supabase
    .from("accounts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/accounts");
  revalidatePath("/dashboard");
}

export async function transferBetweenAccounts(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const from_id = formData.get("from_account_id") as string;
  const to_id = formData.get("to_account_id") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const description = (formData.get("description") as string) || "Transfer";
  const transaction_date =
    (formData.get("transaction_date") as string) ||
    new Date().toISOString().split("T")[0];

  if (!from_id || !to_id || !amount || amount <= 0) {
    throw new Error("From, to, and positive amount are required.");
  }
  if (from_id === to_id) {
    throw new Error("Cannot transfer to the same account.");
  }

  // Record a single transfer transaction
  // "type" is expense because it's leaving the source account
  // transfer_to_account_id will be read by the balance helper
  const { error } = await supabase.from("transactions").insert({
    user_id: user.id,
    type: "expense",
    amount,
    category: "Transfer",
    description,
    transaction_date,
    is_transfer: true,
    account_id: from_id,
    transfer_to_account_id: to_id,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/accounts");
  revalidatePath("/dashboard");
}

export async function archiveAccount(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const id = formData.get("id") as string;
  const archived = formData.get("archived") === "true";

  const { error } = await supabase
    .from("accounts")
    .update({ is_archived: archived })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/accounts");
  revalidatePath("/dashboard");
}