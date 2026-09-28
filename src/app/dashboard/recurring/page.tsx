import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import RecurringCard from "@/components/RecurringCard";
import { generateDueRecurring } from "@/app/dashboard/recurring-actions";
import type { Transaction } from "@/lib/types";

export default async function RecurringPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Auto-generate any due recurring transactions before rendering
  await generateDueRecurring();

  const { data: recurring } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_recurring", true)
    .order("next_occurrence", { ascending: true });

  const list = (recurring ?? []) as Transaction[];

  const activeCount = list.length;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Recurring Transactions 🔄
              </h1>
              <p className="text-gray-400">
                Manage subscriptions, bills, and regular income.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-sm">
              <span className="text-gray-400">Active: </span>
              <span className="font-semibold text-emerald-400">
                {activeCount}
              </span>
            </div>
          </div>

          {list.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
              <p className="text-4xl mb-3">🔄</p>
              <h3 className="text-lg font-semibold mb-2">
                No recurring transactions
              </h3>
              <p className="text-gray-400 text-sm max-w-md mx-auto">
                On the dashboard, check <strong>Repeat this transaction</strong>{" "}
                when adding a new transaction to set up a recurring one.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {list.map((t) => (
                <RecurringCard key={t.id} transaction={t} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}