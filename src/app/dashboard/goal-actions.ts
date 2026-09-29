"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function addGoal(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = (formData.get("name") as string)?.trim();
  const target_amount = parseFloat(formData.get("target_amount") as string);
  const deadline = (formData.get("deadline") as string) || null;
  const icon = (formData.get("icon") as string) || "🎯";
  const color = (formData.get("color") as string) || "emerald";

  if (!name || !target_amount || target_amount <= 0) {
    throw new Error("Name and positive target amount are required.");
  }

  const { error } = await supabase.from("goals").insert({
    user_id: user.id,
    name,
    target_amount,
    deadline,
    icon,
    color,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/goals");
  revalidatePath("/dashboard");
}

export async function contributeToGoal(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const goal_id = formData.get("goal_id") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const note = (formData.get("note") as string) || null;

  if (!goal_id || !amount || amount <= 0) {
    throw new Error("Goal and positive amount are required.");
  }

  // Fetch current goal
  const { data: goal } = await supabase
    .from("goals")
    .select("*")
    .eq("id", goal_id)
    .eq("user_id", user.id)
    .single();

  if (!goal) throw new Error("Goal not found.");

  const newSaved = Number(goal.saved_amount) + amount;
  const completed = newSaved >= Number(goal.target_amount);

  const { error: updateError } = await supabase
    .from("goals")
    .update({
      saved_amount: newSaved,
      is_completed: completed,
      updated_at: new Date().toISOString(),
    })
    .eq("id", goal_id)
    .eq("user_id", user.id);

  if (updateError) throw new Error(updateError.message);

  // Log contribution
  await supabase.from("goal_contributions").insert({
    goal_id,
    user_id: user.id,
    amount,
    note,
  });

  revalidatePath("/dashboard/goals");
  revalidatePath("/dashboard");
}

export async function deleteGoal(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const id = formData.get("id") as string;

  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/goals");
  revalidatePath("/dashboard");
}