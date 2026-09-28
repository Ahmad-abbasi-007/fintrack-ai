"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { RecurrenceFrequency } from "@/lib/types";

/**
 * Calculate next occurrence date from a given date + frequency
 */
function calculateNextOccurrence(
  fromDate: string,
  frequency: RecurrenceFrequency
): string {
  const d = new Date(fromDate);

  switch (frequency) {
    case "weekly":
      d.setDate(d.getDate() + 7);
      break;
    case "monthly":
      d.setMonth(d.getMonth() + 1);
      break;
    case "yearly":
      d.setFullYear(d.getFullYear() + 1);
      break;
  }

  return d.toISOString().split("T")[0];
}

/**
 * Toggle recurring flag on an existing transaction.
 * Also sets next_occurrence if enabling.
 */
export async function toggleRecurring(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const id = formData.get("id") as string;
  const enable = formData.get("enable") === "true";
  const frequency = formData.get("frequency") as RecurrenceFrequency | null;

  if (enable && !frequency) {
    throw new Error("Frequency is required to enable recurring");
  }

  // Fetch current transaction
  const { data: txn } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!txn) throw new Error("Transaction not found");

  const update = enable
    ? {
        is_recurring: true,
        recurrence: frequency,
        next_occurrence: calculateNextOccurrence(
          txn.transaction_date,
          frequency!
        ),
      }
    : {
        is_recurring: false,
        recurrence: null,
        next_occurrence: null,
      };

  const { error } = await supabase
    .from("transactions")
    .update(update)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/recurring");
}

/**
 * Delete a recurring transaction and all its generated instances.
 */
export async function deleteRecurringSeries(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const id = formData.get("id") as string;

  // Delete parent + all children
  const { error } = await supabase
    .from("transactions")
    .delete()
    .or(`id.eq.${id},parent_id.eq.${id}`)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/recurring");
}

/**
 * Generate all due recurring transactions.
 * Called when user visits dashboard or recurring page.
 */
export async function generateDueRecurring() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const today = new Date().toISOString().split("T")[0];

  // Find recurring parents whose next_occurrence is today or earlier
  const { data: due } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_recurring", true)
    .lte("next_occurrence", today);

  if (!due || due.length === 0) return;

  for (const parent of due) {
    // Create instances up to today
    let next = parent.next_occurrence as string;
    const frequency = parent.recurrence as RecurrenceFrequency;

    while (next && next <= today) {
      // Insert a new transaction as child
      await supabase.from("transactions").insert({
        user_id: user.id,
        type: parent.type,
        amount: parent.amount,
        category: parent.category,
        description: parent.description,
        transaction_date: next,
        is_recurring: false,
        recurrence: null,
        next_occurrence: null,
        parent_id: parent.id,
      });

      next = calculateNextOccurrence(next, frequency);
    }

    // Update parent's next_occurrence to the first future date
    await supabase
      .from("transactions")
      .update({ next_occurrence: next })
      .eq("id", parent.id)
      .eq("user_id", user.id);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/recurring");
}