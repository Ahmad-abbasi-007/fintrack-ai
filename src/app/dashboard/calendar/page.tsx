import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import CalendarView from "@/components/CalendarView";
import type { Transaction, Bill } from "@/lib/types";

export default async function CalendarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .order("transaction_date", { ascending: false });

  const { data: bills } = await supabase
    .from("bills")
    .select("*")
    .order("due_date", { ascending: true });

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Calendar 📅</h1>
          <p className="text-gray-400 mb-8">
            See your income, expenses, and bills at a glance.
          </p>

          <CalendarView
            transactions={(transactions ?? []) as Transaction[]}
            bills={(bills ?? []) as Bill[]}
          />
        </main>
      </div>
    </div>
  );
}