import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ReportFilters from "@/components/ReportFilters";
import ExportCSVButton from "@/components/ExportCSVButton";
import TransactionList from "@/components/TransactionList";
import { applyFilters, type ReportFilters as RF } from "@/lib/report-filters";
import type { Transaction } from "@/lib/types";
import { formatCurrency } from "@/lib/currency";

type SearchParams = Promise<{
  range?: string;
  type?: string;
  category?: string;
  search?: string;
  from?: string;
  to?: string;
}>;

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .order("transaction_date", { ascending: false });

  const all = (transactions ?? []) as Transaction[];

  const sp = await searchParams;

  const filters: RF = {
    range: (sp.range as RF["range"]) || "this-month",
    type: (sp.type as RF["type"]) || "all",
    category: sp.category || "all",
    search: sp.search || "",
    from: sp.from,
    to: sp.to,
  };

  const filtered = applyFilters(all, filters);

  const totalIncome = filtered
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = filtered
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const net = totalIncome - totalExpense;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Reports 📄
              </h1>
              <p className="text-gray-400">
                Filter, analyze, and export your transactions.
              </p>
            </div>
            <ExportCSVButton
              transactions={filtered}
              filename={`fintrack-report-${today}.csv`}
            />
          </div>

          {/* Filters */}
          <ReportFilters />

          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatCard
              label="Income (filtered)"
              value={formatCurrency(totalIncome)}
              icon="📈"
              color="text-emerald-400"
            />
            <StatCard
              label="Expenses (filtered)"
              value={formatCurrency(totalExpense)}
              icon="📉"
              color="text-red-400"
            />
            <StatCard
              label="Net (filtered)"
              value={formatCurrency(net)}
              icon="💰"
              color={net >= 0 ? "text-emerald-400" : "text-red-400"}
            />
          </div>

          {/* Results */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">
                Results
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({filtered.length}{" "}
                  {filtered.length === 1 ? "transaction" : "transactions"})
                </span>
              </h2>
            </div>

            <TransactionList transactions={filtered} />
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