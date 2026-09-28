import { deleteBudget } from "@/app/dashboard/budget-actions";
import type { BudgetStatus } from "@/lib/types";
import { formatCurrency } from "@/lib/currency";

const STYLE: Record<
  BudgetStatus["state"],
  { bar: string; text: string; label: string; icon: string }
> = {
  safe: {
    bar: "bg-emerald-500",
    text: "text-emerald-400",
    label: "On track",
    icon: "✅",
  },
  warning: {
    bar: "bg-amber-500",
    text: "text-amber-400",
    label: "Approaching limit",
    icon: "⚠️",
  },
  exceeded: {
    bar: "bg-red-500",
    text: "text-red-400",
    label: "Over budget",
    icon: "🚨",
  },
};

export default function BudgetCard({ status }: { status: BudgetStatus }) {
  const { budget, spent, remaining, percent, state } = status;
  const s = STYLE[state];
  const barWidth = Math.min(percent, 100);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold">{budget.category}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">
            Limit: {formatCurrency(budget.monthly_limit)}
          </p>
        </div>
        <form action={deleteBudget}>
          <input type="hidden" name="id" value={budget.id} />
          <button
            type="submit"
            className="text-gray-500 hover:text-red-400 transition text-sm"
            title="Delete budget"
          >
            ✕
          </button>
        </form>
      </div>

      <div className="flex items-baseline justify-between mb-2 text-sm">
                <span className="text-gray-400">
          Spent:{" "}
          <span className="text-white font-medium">
            {formatCurrency(spent)}
          </span>
        </span>
        <span className={`text-xs font-medium ${s.text}`}>
          {percent.toFixed(0)}%
        </span>
      </div>

      <div className="h-2.5 bg-gray-950 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full ${s.bar} transition-all duration-500`}
          style={{ width: `${barWidth}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-xs ${s.text}`}>
          {s.icon} {s.label}
        </span>
                <span className="text-xs text-gray-400">
          {formatCurrency(remaining)} left
        </span>
      </div>
    </div>
  );
}