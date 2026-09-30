import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import AccountForm from "@/components/AccountForm";
import AccountCard from "@/components/AccountCard";
import TransferForm from "@/components/TransferForm";
import EmptyState from "@/components/EmptyState";
import {
  getAccountsWithBalance,
  getTotalNetWorth,
} from "@/lib/account-stats";
import { formatCurrency } from "@/lib/currency";
import type { Account, Transaction } from "@/lib/types";

export default async function AccountsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: accountsData } = await supabase
    .from("accounts")
    .select("*")
    .order("created_at", { ascending: true });

  const { data: txnsData } = await supabase
    .from("transactions")
    .select("*");

  const accounts = (accountsData ?? []) as Account[];
  const transactions = (txnsData ?? []) as Transaction[];

  const withBalance = getAccountsWithBalance(accounts, transactions);
  const netWorth = getTotalNetWorth(withBalance);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Accounts 💳
          </h1>
          <p className="text-gray-400 mb-8">
            Track balances across cash, bank, cards, and wallets.
          </p>

          {/* Net worth summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              label="Total Net Worth"
              value={formatCurrency(netWorth)}
              icon="💰"
              color={netWorth >= 0 ? "text-emerald-400" : "text-red-400"}
            />
            <StatCard
              label="Active Accounts"
              value={String(
                withBalance.filter((a) => !a.is_archived).length
              )}
              icon="💳"
              color="text-blue-400"
            />
            <StatCard
              label="Archived"
              value={String(withBalance.filter((a) => a.is_archived).length)}
              icon="📦"
              color="text-gray-400"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <AccountForm />
              <TransferForm accounts={accounts} />
            </div>

            <div className="lg:col-span-2">
              {withBalance.length === 0 ? (
                <EmptyState
                  icon="💳"
                  title="No accounts yet"
                  description="Add your first account on the left to start tracking balances."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {withBalance.map((a) => (
                    <AccountCard key={a.id} account={a} />
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