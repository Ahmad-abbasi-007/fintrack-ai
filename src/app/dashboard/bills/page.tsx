import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import BillForm from "@/components/BillForm";
import BillCard from "@/components/BillCard";
import EmptyState from "@/components/EmptyState";
import { formatCurrency } from "@/lib/currency";
import type { Bill } from "@/lib/types";

export default async function BillsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("bills")
    .select("*")
    .order("is_paid", { ascending: true })
    .order("due_date", { ascending: true });

  const bills = (data ?? []) as Bill[];

  const today = new Date().toISOString().split("T")[0];
  const overdue = bills.filter((b) => !b.is_paid && b.due_date < today);
  const upcoming = bills.filter((b) => !b.is_paid && b.due_date >= today);
  const paid = bills.filter((b) => b.is_paid);

  const totalUnpaid = upcoming
    .concat(overdue)
    .reduce((s, b) => s + Number(b.amount), 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Bills 📆</h1>
          <p className="text-gray-400 mb-8">
            Track upcoming bills and never miss a payment.
          </p>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              label="Unpaid Bills"
              value={String(upcoming.length + overdue.length)}
              icon="📋"
              color="text-emerald-400"
            />
            <StatCard
              label="Total Unpaid"
              value={formatCurrency(totalUnpaid)}
              icon="💸"
              color="text-amber-400"
            />
            <StatCard
              label="Overdue"
              value={String(overdue.length)}
              icon="🚨"
              color="text-red-400"
            />
            <StatCard
              label="Paid Bills"
              value={String(paid.length)}
              icon="✅"
              color="text-emerald-400"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <BillForm />
            </div>

            <div className="lg:col-span-2 space-y-6">
              {bills.length === 0 ? (
                <EmptyState
                  icon="📆"
                  title="No bills yet"
                  description="Add your first bill on the left and track when it's due."
                />
              ) : (
                <>
                  {overdue.length > 0 && (
                    <div>
                      <h2 className="text-sm font-semibold text-red-400 mb-3 uppercase tracking-wide">
                        🚨 Overdue
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {overdue.map((b) => (
                          <BillCard key={b.id} bill={b} />
                        ))}
                      </div>
                    </div>
                  )}

                  {upcoming.length > 0 && (
                    <div>
                      <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                        📋 Upcoming
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {upcoming.map((b) => (
                          <BillCard key={b.id} bill={b} />
                        ))}
                      </div>
                    </div>
                  )}

                  {paid.length > 0 && (
                    <div>
                      <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                        ✅ Paid
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {paid.slice(0, 10).map((b) => (
                          <BillCard key={b.id} bill={b} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
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
      <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}