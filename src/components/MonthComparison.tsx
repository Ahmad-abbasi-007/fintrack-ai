import type { Transaction } from "@/lib/types";
import { formatCurrency } from "@/lib/currency";

function getMonthStats(
  transactions: Transaction[],
  offset: number
) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() - offset + 1, 0, 23, 59, 59);

  const inRange = transactions.filter((t) => {
    const d = new Date(t.transaction_date);
    return d >= start && d <= end;
  });

  const income = inRange
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + Number(t.amount), 0);

  const expense = inRange
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);

  return { income, expense, net: income - expense };
}

export default function MonthComparison({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const current = getMonthStats(transactions, 0);
  const previous = getMonthStats(transactions, 1);

  const rows: {
    label: string;
    current: number;
    previous: number;
    invertGood?: boolean;
  }[] = [
    { label: "Income", current: current.income, previous: previous.income },
    {
      label: "Expenses",
      current: current.expense,
      previous: previous.expense,
      invertGood: true,
    },
    { label: "Net", current: current.net, previous: previous.net },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">This Month vs Last Month</h3>

      <div className="space-y-4">
        {rows.map((row) => {
          const delta = row.current - row.previous;
          const pct =
            row.previous === 0
              ? null
              : Math.round((delta / Math.abs(row.previous)) * 100);

          const improved = row.invertGood ? delta < 0 : delta > 0;
          const worsened = row.invertGood ? delta > 0 : delta < 0;

          const color =
            delta === 0
              ? "text-gray-400"
              : improved
              ? "text-emerald-400"
              : worsened
              ? "text-red-400"
              : "text-gray-400";

          const arrow = delta > 0 ? "↑" : delta < 0 ? "↓" : "→";

          return (
            <div
              key={row.label}
              className="flex items-center justify-between border-b border-gray-800 last:border-0 pb-3 last:pb-0"
            >
              <div>
                <p className="text-sm font-medium">{row.label}</p>
                <p className="text-xs text-gray-500">
                  Last month: {formatCurrency(row.previous)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {formatCurrency(row.current)}
                </p>
                <p className={`text-xs ${color}`}>
                  {arrow} {Math.abs(delta).toFixed(2)}
                  {pct !== null && ` (${pct > 0 ? "+" : ""}${pct}%)`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}