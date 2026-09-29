"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserSettings } from "@/lib/types";

export async function getUserSettings(): Promise<UserSettings | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return null;

  // If no settings exist, create defaults
  if (!data) {
    const { data: created } = await supabase
      .from("user_settings")
      .insert({ user_id: user.id })
      .select()
      .single();
    return (created as UserSettings) ?? null;
  }

  return data as UserSettings;
}

export async function updateSettings(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  const theme = formData.get("theme") as string | null;
  if (theme && ["dark", "light", "system"].includes(theme)) {
    updates.theme = theme;
  }

  const currency = formData.get("currency") as string | null;
  if (currency) updates.currency = currency;

  const language = formData.get("language") as string | null;
  if (language) updates.language = language;

  const budgetAlerts = formData.get("budget_alerts");
  if (budgetAlerts !== null) updates.budget_alerts = budgetAlerts === "on";

  const recurringReminders = formData.get("recurring_reminders");
  if (recurringReminders !== null)
    updates.recurring_reminders = recurringReminders === "on";

  const { error } = await supabase
    .from("user_settings")
    .update(updates)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/budgets");
  revalidatePath("/dashboard/reports");
}