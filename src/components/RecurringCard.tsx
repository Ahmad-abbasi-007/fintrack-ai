import {
  deleteRecurringSeries,
  toggleRecurring,
} from "@/app/dashboard/recurring-actions";
import type { Transaction } from "@/lib/types";

export default function RecurringCard({
  transaction,
}: {
  transaction: Transaction;
}) {
  const isIncome = transaction.type === "income";
  const next = transaction.next_occurrence;

  const daysUntil = next
    ? Math.ceil(
        (new Date(next).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : null;

  const nextLabel =
    daysUntil === null
      ? "—"
      : daysUntil === 0
      ? "Today"
      : daysUntil === 1
      ? "Tomorrow"
      : daysUntil > 0
      ? `in ${daysUntil} days`
      : `${Math.abs(daysUntil)} days ago`;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
              isIncome
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {isIncome ? "📈" : "📉"}
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">
              {transaction.description || transaction.category}
            </p>
            <p className="text-xs text-gray-400">
              {transaction.category} • repeats{" "}
              <span className="text-blue-400">{transaction.recurrence}</span>
            </p>
          </div>
        </div>

        <p
          className={`font-semibold shrink-0 ${
            isIncome ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {isIncome ? "+" : "-"}${Number(transaction.amount).toFixed(2)}
        </p>
      </div>

      <div className="bg-gray-950 border border-gray-800 rounded-lg p-3 mb-3">
        <p className="text-xs text-gray-500 mb-0.5">Next occurrence</p>
        <p className="text-sm font-medium">
          {next
            ? new Date(next).toLocaleDateString()
            : "—"}{" "}
          <span className="text-gray-500 text-xs">({nextLabel})</span>
        </p>
      </div>

      <div className="flex gap-2">
        <form action={toggleRecurring} className="flex-1">
          <input type="hidden" name="id" value={transaction.id} />
          <input type="hidden" name="enable" value="false" />
          <button
            type="submit"
            className="w-full text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 py-2 rounded-lg"
          >
            Stop Repeating
          </button>
        </form>

        <form action={deleteRecurringSeries} className="flex-1">
          <input type="hidden" name="id" value={transaction.id} />
          <button
            type="submit"
            className="w-full text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 py-2 rounded-lg"
          >
            Delete Series
          </button>
        </form>
      </div>
    </div>
  );
}