import { deleteTransaction } from "@/app/dashboard/actions";
import type { Transaction } from "@/lib/types";

export default function TransactionList({
  transactions,
}: {
  transactions: Transaction[];
}) {
  if (transactions.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
        <p className="text-4xl mb-3">📭</p>
        <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
        <p className="text-gray-400 text-sm">
          Add your first transaction using the form to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
      </div>

      <ul className="divide-y divide-gray-800">
        {transactions.map((t) => {
          const isIncome = t.type === "income";
          return (
            <li
              key={t.id}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-950/50"
            >
              <div className="flex items-center gap-4 min-w-0">
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
                    {t.description || t.category}
                  </p>
                  <p className="text-xs text-gray-400">
                    {t.category} •{" "}
                    {new Date(t.transaction_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <p
                  className={`font-semibold ${
                    isIncome ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {isIncome ? "+" : "-"}${Number(t.amount).toFixed(2)}
                </p>

                <form action={deleteTransaction}>
                  <input type="hidden" name="id" value={t.id} />
                  <button
                    type="submit"
                    className="text-gray-500 hover:text-red-400 transition text-sm"
                    title="Delete"
                  >
                    ✕
                  </button>
                </form>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}