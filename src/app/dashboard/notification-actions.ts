"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Budget, Transaction } from "@/lib/types";

export async function markNotificationRead(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const id = formData.get("id") as string;

  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/dashboard");
}

export async function markAllRead() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id);

  revalidatePath("/dashboard");
}

export async function deleteNotification(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const id = formData.get("id") as string;

  await supabase
    .from("notifications")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/dashboard");
}

/**
 * Scan user's data and create notifications for:
 * - budgets near/over limit
 * - upcoming recurring transactions
 * Idempotent: avoids duplicates by checking title+message in last 24h.
 */
export async function generateNotifications() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // Get existing notifications from last 24h to avoid duplicates
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: recent } = await supabase
    .from("notifications")
    .select("title")
    .eq("user_id", user.id)
    .gte("created_at", since);

  const recentTitles = new Set((recent ?? []).map((n) => n.title));

  // ---- Budget alerts ----
  const { data: budgets } = await supabase
    .from("budgets")
    .select("*")
    .eq("user_id", user.id);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const { data: monthTxns } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .eq("type", "expense")
    .gte("transaction_date", monthStart.toISOString().split("T")[0]);

  const txns = (monthTxns ?? []) as Transaction[];
  const budgetList = (budgets ?? []) as Budget[];

  for (const b of budgetList) {
    const spent = txns
      .filter((t) => t.category === b.category)
      .reduce((s, t) => s + Number(t.amount), 0);
    const limit = Number(b.monthly_limit);
    const pct = limit > 0 ? (spent / limit) * 100 : 0;

    if (pct >= 100) {
      const title = `Over budget: ${b.category}`;
      if (!recentTitles.has(title)) {
        await supabase.from("notifications").insert({
          user_id: user.id,
          type: "danger",
          title,
          message: `You've spent Rs. ${spent.toFixed(
            2
          )} of your Rs. ${limit.toFixed(2)} ${b.category} budget.`,
          link: "/dashboard/budgets",
        });
      }
    } else if (pct >= 80) {
      const title = `Approaching budget: ${b.category}`;
      if (!recentTitles.has(title)) {
        await supabase.from("notifications").insert({
          user_id: user.id,
          type: "warning",
          title,
          message: `${pct.toFixed(
            0
          )}% of your ${b.category} budget used. Slow down to stay on track.`,
          link: "/dashboard/budgets",
        });
      }
    }
  }

  // ---- Upcoming recurring ----
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  const today = new Date().toISOString().split("T")[0];
  const upcoming = threeDaysFromNow.toISOString().split("T")[0];

  const { data: recurring } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_recurring", true)
    .gte("next_occurrence", today)
    .lte("next_occurrence", upcoming);

  for (const r of recurring ?? []) {
    const title = `Upcoming: ${r.description || r.category}`;
    if (!recentTitles.has(title)) {
      await supabase.from("notifications").insert({
        user_id: user.id,
        type: "info",
        title,
        message: `${r.category} — Rs. ${Number(r.amount).toFixed(
          2
        )} due on ${new Date(r.next_occurrence!).toLocaleDateString()}.`,
        link: "/dashboard/recurring",
      });
    }
  }

  revalidatePath("/dashboard");
}