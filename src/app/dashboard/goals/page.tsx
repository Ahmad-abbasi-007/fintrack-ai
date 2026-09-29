import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import GoalForm from "@/components/GoalForm";
import GoalCard from "@/components/GoalCard";
import EmptyState from "@/components/EmptyState";
import { getGoalStatus, getGoalSummary } from "@/lib/goal-stats";
import { formatCurrency } from "@/lib/currency";
import type { Goal } from "@/lib/types";

export default async function GoalsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("goals")
    .select("*")
    .order("is_completed", { ascending: true })
    .order("created_at", { ascending: false });

  const goals = (data ?? []) as Goal[];
  const statuses = goals.map(getGoalStatus);
  const summary = getGoalSummary(goals);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Savings Goals 🎯
          </h1>
          <p className="text-gray-400 mb-8">
            Set targets, track progress, achieve your dreams.
          </p>

          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              label="Active Goals"
              value={String(summary.active)}
              icon="🎯"
              color="text-emerald-400"
            />
            <StatCard
              label="Total Saved"
              value={formatCurrency(summary.totalSaved)}
              icon="💰"
              color="text-emerald-400"
            />
            <StatCard
              label="Goals Completed"
              value={String(summary.completed)}
              icon="🏆"
              color="text-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-1">
              <GoalForm />
            </div>

            {/* Goals list */}
            <div className="lg:col-span-2">
              {statuses.length === 0 ? (
                <EmptyState
                  icon="🎯"
                  title="No goals yet"
                  description="Create your first savings goal on the left — a new phone, a trip, an emergency fund — and watch your progress grow."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {statuses.map((status) => (
                    <GoalCard key={status.goal.id} status={status} />
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