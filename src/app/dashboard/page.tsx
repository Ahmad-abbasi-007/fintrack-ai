import { redirect } from "next/navigation";
import Link from "next/link";
import { getGoalStatus } from "@/lib/goal-stats";
import type { Goal as GoalType } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import MonthComparison from "@/components/MonthComparison";
import Sidebar from "@/components/Sidebar";
import TransactionInputPanel from "@/components/TransactionInputPanel";
import TransactionList from "@/components/TransactionList";
import CategoryPieChart from "@/components/CategoryPieChart";
import AIInsights from "@/components/AIInsights";
import MonthlyBarChart from "@/components/MonthlyBarChart";
import TopCategories from "@/components/TopCategories";
import DashboardMaintenance from "@/components/DashboardMaintenance";
import {
  getCategoryBreakdown,
  getMonthlyStats,
} from "@/lib/stats";
import { getBudgetStatuses } from "@/lib/budget-stats";
import { formatCurrency } from "@/lib/currency";
import type { Transaction, Budget as BudgetType } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false });

  const list = (transactions ?? []) as Transaction[];

  const totalIncome = list
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = list
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  const expenseByCategory = getCategoryBreakdown(list, "expense");
  const incomeByCategory = getCategoryBreakdown(list, "income");
  const monthly = getMonthlyStats(list, 6);

  // Fetch budgets and compute statuses
  const { data: budgetsData } = await supabase.from("budgets").select("*");
  const budgets = (budgetsData ?? []) as BudgetType[];
  const budgetStatuses = getBudgetStatuses(budgets, list);

  const overBudgetCount = budgetStatuses.filter(
    (s) => s.state === "exceeded"
  ).length;
  
  const warningCount = budgetStatuses.filter(
    (s) => s.state === "warning"
  ).length;

    // Fetch goals
  const { data: goalsData } = await supabase.from("goals").select("*");
  const goals = (goalsData ?? []) as GoalType[];
  const topGoals = goals
    .filter((g) => !g.is_completed)
    .slice(0, 3)
    .map(getGoalStatus);

  const name = user.user_metadata?.full_name || "there";

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <DashboardMaintenance />
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {name} 👋
          </h1>
          <p className="text-gray-400 mb-10">
            Here&apos;s an overview of your finances.
          </p>

          {/* Stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatCard
              label="Total Balance"
              value={formatCurrency(balance)}
              icon="💰"
              color={balance >= 0 ? "text-emerald-400" : "text-red-400"}
            />
            <StatCard
              label="Total Income"
              value={formatCurrency(totalIncome)}
              icon="📈"
              color="text-emerald-400"
            />
            <StatCard
              label="Total Expenses"
              value={formatCurrency(totalExpense)}
              icon="📉"
              color="text-red-400"
            />
          </div>

          {/* Budget alerts banner */}
          {(overBudgetCount > 0 || warningCount > 0) && (
            <div
              className={`mb-6 rounded-2xl p-4 border flex items-center justify-between flex-wrap gap-3 ${
                overBudgetCount > 0
                  ? "bg-red-500/10 border-red-500/30"
                  : "bg-amber-500/10 border-amber-500/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {overBudgetCount > 0 ? "🚨" : "⚠️"}
                </span>
                <div>
                  <p
                    className={`font-semibold ${
                      overBudgetCount > 0
                        ? "text-red-400"
                        : "text-amber-400"
                    }`}
                  >
                    {overBudgetCount > 0
                      ? `${overBudgetCount} budget${
                          overBudgetCount > 1 ? "s" : ""
                        } exceeded`
                      : `${warningCount} budget${
                          warningCount > 1 ? "s" : ""
                        } approaching limit`}
                  </p>
                  <p className="text-sm text-gray-400">
                    Review your spending to stay on track.
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/budgets"
                className="text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-2"
              >
                View Budgets →
              </Link>
            </div>
          )}

          {/* AI Insights */}
          <div className="mb-6">
            <AIInsights />
          </div>
                    {/* Goals preview */}
          {topGoals.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">🎯 Your Goals</h2>
                <Link
                  href="/dashboard/goals"
                  className="text-sm text-emerald-400 hover:underline"
                >
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topGoals.map((s) => (
                  <div
                    key={s.goal.id}
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{s.goal.icon}</span>
                      <p className="font-medium truncate">{s.goal.name}</p>
                    </div>
                    <div className="h-2 bg-gray-950 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-emerald-500 transition-all"
                        style={{ width: `${s.percent}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400">
                      {s.percent.toFixed(0)}% •{" "}
                      {formatCurrency(s.remaining)} to go
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

                    {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-1">
              <MonthComparison transactions={list} />
            </div>
            <div className="lg:col-span-1">
              <CategoryPieChart
                data={expenseByCategory}
                title="Expenses by Category"
              />
            </div>
            <div className="lg:col-span-1">
              <MonthlyBarChart data={monthly} />
            </div>
          </div>

          {/* Top categories + income breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <TopCategories
              data={expenseByCategory}
              title="Top Spending Categories"
            />
            <TopCategories
              data={incomeByCategory}
              title="Income Sources"
            />
          </div>

          {/* Add form + transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <TransactionInputPanel />
            </div>
            <div className="lg:col-span-2">
              <TransactionList transactions={list} />
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