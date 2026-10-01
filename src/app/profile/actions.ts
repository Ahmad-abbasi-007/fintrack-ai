"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateFullName(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const full_name = (formData.get("full_name") as string)?.trim();
  if (!full_name) throw new Error("Name cannot be empty.");

  const { error } = await supabase.auth.updateUser({
    data: { full_name },
  });

  if (error) throw new Error(error.message);

  revalidatePath("/profile");
  revalidatePath("/dashboard");
}

export async function updateEmail(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const email = (formData.get("email") as string)?.trim();
  if (!email || !email.includes("@")) throw new Error("Invalid email.");

  const { error } = await supabase.auth.updateUser({ email });
  if (error) throw new Error(error.message);

  revalidatePath("/profile");
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;

  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }
  if (password !== confirm) {
    throw new Error("Passwords don't match.");
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw new Error(error.message);

  revalidatePath("/profile");
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const file = formData.get("avatar") as File;
  if (!file || file.size === 0) throw new Error("Please choose a file.");
  if (file.size > 2 * 1024 * 1024) throw new Error("File must be under 2MB.");
  if (!file.type.startsWith("image/")) throw new Error("Only images allowed.");

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${user.id}/avatar.${ext}`;

  const { error: upErr } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true });

  if (upErr) throw new Error(upErr.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(path);

  // Add cache buster so browser refreshes
  const url = `${publicUrl}?t=${Date.now()}`;

  const { error } = await supabase.auth.updateUser({
    data: { avatar_url: url },
  });

  if (error) throw new Error(error.message);

  revalidatePath("/profile");
  revalidatePath("/dashboard");
}

export async function deleteMyAccount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Delete user's data first (RLS will enforce ownership)
  await supabase.from("transactions").delete().eq("user_id", user.id);
  await supabase.from("budgets").delete().eq("user_id", user.id);
  await supabase.from("goals").delete().eq("user_id", user.id);
  await supabase.from("bills").delete().eq("user_id", user.id);
  await supabase.from("categories").delete().eq("user_id", user.id);
  await supabase.from("accounts").delete().eq("user_id", user.id);
  await supabase.from("notifications").delete().eq("user_id", user.id);
  await supabase.from("user_settings").delete().eq("user_id", user.id);

  // Sign out (account deletion requires admin — user can contact support)
  await supabase.auth.signOut();
  redirect("/login");
}