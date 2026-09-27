import type { CategoryStat } from "@/lib/stats";

export default function TopCategories({
  data,
  title,
}: {
  data: CategoryStat[];
  title: string;
}) {
  const total = data.reduce((sum, d) => sum + d.amount, 0);
  const top = data.slice(0, 5);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      {top.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-6">
          No data yet
        </p>
      ) : (
        <ul className="space-y-4">
          {top.map((item, i) => {
            const pct = total > 0 ? (item.amount / total) * 100 : 0;
            return (
              <li key={item.category}>
                <div className="flex items-center justify-between mb-1.5 text-sm">
                  <span className="font-medium truncate pr-2">
                    {item.category}
                  </span>
                  <span className="text-gray-400 shrink-0">
                    ${item.amount.toFixed(2)} ({pct.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-2 bg-gray-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      i === 0
                        ? "bg-emerald-500"
                        : i === 1
                        ? "bg-blue-500"
                        : i === 2
                        ? "bg-amber-500"
                        : i === 3
                        ? "bg-violet-500"
                        : "bg-pink-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}