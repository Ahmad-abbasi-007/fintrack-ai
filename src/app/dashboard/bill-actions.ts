"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function addBill(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = (formData.get("name") as string)?.trim();
  const amount = parseFloat(formData.get("amount") as string);
  const category = (formData.get("category") as string) || "Bills";
  const due_date = formData.get("due_date") as string;
  const recurrence = (formData.get("recurrence") as string) || null;
  const notes = (formData.get("notes") as string) || null;

  if (!name || !amount || amount <= 0 || !due_date) {
    throw new Error("Name, amount, and due date are required.");
  }

  const { error } = await supabase.from("bills").insert({
    user_id: user.id,
    name,
    amount,
    category,
    due_date,
    recurrence: recurrence || null,
    notes,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/bills");
  revalidatePath("/dashboard/calendar");
  revalidatePath("/dashboard");
}

export async function markBillPaid(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const id = formData.get("id") as string;
  const paid = formData.get("paid") === "true";

  // Fetch bill to check recurrence
  const { data: bill } = await supabase
    .from("bills")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!bill) throw new Error("Bill not found.");

  const { error } = await supabase
    .from("bills")
    .update({
      is_paid: paid,
      paid_at: paid ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  // Auto-create next month's bill if recurring + just paid
  if (paid && bill.recurrence && !bill.is_paid) {
    const due = new Date(bill.due_date);
    if (bill.recurrence === "monthly") {
      due.setMonth(due.getMonth() + 1);
    } else if (bill.recurrence === "yearly") {
      due.setFullYear(due.getFullYear() + 1);
    }

    await supabase.from("bills").insert({
      user_id: user.id,
      name: bill.name,
      amount: bill.amount,
      category: bill.category,
      due_date: due.toISOString().split("T")[0],
      recurrence: bill.recurrence,
      notes: bill.notes,
    });
  }

  revalidatePath("/dashboard/bills");
  revalidatePath("/dashboard/calendar");
  revalidatePath("/dashboard");
}

export async function deleteBill(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const id = formData.get("id") as string;

  const { error } = await supabase
    .from("bills")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/bills");
  revalidatePath("/dashboard/calendar");
  revalidatePath("/dashboard");
}