import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import BudgetForm from "@/components/BudgetForm";
import BudgetCard from "@/components/BudgetCard";
import { getBudgetStatuses } from "@/lib/budget-stats";
import { formatCurrency } from "@/lib/currency";
import type { Budget, Transaction } from "@/lib/types";
import EmptyState from "@/components/EmptyState";

export default async function BudgetsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: budgets } = await supabase
    .from("budgets")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*");

  const budgetList = (budgets ?? []) as Budget[];
  const transactionList = (transactions ?? []) as Transaction[];

  const statuses = getBudgetStatuses(budgetList, transactionList);
  const existingCategories = budgetList.map((b) => b.category);

  const totalLimit = budgetList.reduce(
    (sum, b) => sum + Number(b.monthly_limit),
    0
  );
  const totalSpent = statuses.reduce((sum, s) => sum + s.spent, 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Budget Goals 🎯
          </h1>
          <p className="text-gray-400 mb-8">
            Set monthly limits per category and stay on track.
          </p>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              label="Total Monthly Budget"
              value={formatCurrency(totalLimit)}
              icon="🎯"
              color="text-emerald-400"
            />
            <StatCard
              label="Spent This Month"
              value={formatCurrency(totalSpent)}
              icon="💸"
              color="text-amber-400"
            />
            <StatCard
              label="Remaining"
              value={formatCurrency(Math.max(totalLimit - totalSpent, 0))}
              icon="💰"
              color="text-emerald-400"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-1">
              <BudgetForm existingCategories={existingCategories} />
            </div>

            {/* Budgets grid */}
            <div className="lg:col-span-2">
                            {statuses.length === 0 ? (
                <EmptyState
                  icon="🎯"
                  title="No budgets set yet"
                  description="Set a budget on the left to start tracking your limits and get alerts."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {statuses.map((status) => (
                    <BudgetCard key={status.budget.id} status={status} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}