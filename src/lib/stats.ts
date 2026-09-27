import type { Transaction } from "@/lib/types";

export type CategoryStat = {
  category: string;
  amount: number;
  count: number;
};

export type MonthlyStat = {
  month: string; // "Jan", "Feb", ...
  income: number;
  expense: number;
};

export function getCategoryBreakdown(
  transactions: Transaction[],
  type: "income" | "expense"
): CategoryStat[] {
  const map = new Map<string, CategoryStat>();

  transactions
    .filter((t) => t.type === type)
    .forEach((t) => {
      const existing = map.get(t.category);
      if (existing) {
        existing.amount += Number(t.amount);
        existing.count += 1;
      } else {
        map.set(t.category, {
          category: t.category,
          amount: Number(t.amount),
          count: 1,
        });
      }
    });

  return Array.from(map.values()).sort((a, b) => b.amount - a.amount);
}

export function getMonthlyStats(
  transactions: Transaction[],
  monthsBack = 6
): MonthlyStat[] {
  const now = new Date();
  const buckets: MonthlyStat[] = [];

  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      month: d.toLocaleString("en-US", { month: "short" }),
      income: 0,
      expense: 0,
    });
  }

  const startMonth = new Date(
    now.getFullYear(),
    now.getMonth() - (monthsBack - 1),
    1
  );

  transactions.forEach((t) => {
    const d = new Date(t.transaction_date);
    if (d < startMonth) return;

    const monthsDiff =
      (now.getFullYear() - d.getFullYear()) * 12 +
      (now.getMonth() - d.getMonth());
    const idx = monthsBack - 1 - monthsDiff;
    if (idx < 0 || idx >= monthsBack) return;

    if (t.type === "income") {
      buckets[idx].income += Number(t.amount);
    } else {
      buckets[idx].expense += Number(t.amount);
    }
  });

  return buckets;
}

export const CHART_COLORS = [
  "#10b981", // emerald
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
  "#06b6d4", // cyan
  "#a855f7", // purple
];
