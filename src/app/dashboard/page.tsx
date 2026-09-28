import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import AddTransactionForm from "@/components/AddTransactionForm";
import TransactionList from "@/components/TransactionList";
import CategoryPieChart from "@/components/CategoryPieChart";
import AIInsights from "@/components/AIInsights";
import MonthlyBarChart from "@/components/MonthlyBarChart";
import TopCategories from "@/components/TopCategories";
import {
  getCategoryBreakdown,
  getMonthlyStats,
} from "@/lib/stats";
import type { Transaction } from "@/lib/types";

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

  const name = user.user_metadata?.full_name || "there";

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
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
              value={`$${balance.toFixed(2)}`}
              icon="💰"
              color={balance >= 0 ? "text-emerald-400" : "text-red-400"}
            />
            <StatCard
              label="Total Income"
              value={`$${totalIncome.toFixed(2)}`}
              icon="📈"
              color="text-emerald-400"
            />
            <StatCard
              label="Total Expenses"
              value={`$${totalExpense.toFixed(2)}`}
              icon="📉"
              color="text-red-400"
            />
          </div>
               {/* AI Insights */}
          <div className="mb-6">
            <AIInsights />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <CategoryPieChart
              data={expenseByCategory}
              title="Expenses by Category"
            />
            <MonthlyBarChart data={monthly} />
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
              <AddTransactionForm />
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