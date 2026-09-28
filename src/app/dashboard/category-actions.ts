"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function addCategory(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const name = (formData.get("name") as string)?.trim();
  const type = formData.get("type") as "income" | "expense";

  if (!name || !type) throw new Error("Name and type are required");

  const { error } = await supabase
    .from("categories")
    .insert({ user_id: user.id, name, type });

  if (error) {
    if (error.message.includes("duplicate")) {
      throw new Error("This category already exists.");
    }
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/reports");
}

export async function renameCategory(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim();

  if (!name) throw new Error("Name is required");

  const { error } = await supabase
    .from("categories")
    .update({ name })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/reports");
}

export async function deleteCategory(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const id = formData.get("id") as string;

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/reports");
}