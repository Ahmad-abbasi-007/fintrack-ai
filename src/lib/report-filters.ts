import type { Transaction } from "@/lib/types";

export type DateRangeKey =
  | "this-month"
  | "last-month"
  | "last-3-months"
  | "this-year"
  | "all-time"
  | "custom";

export type ReportFilters = {
  range: DateRangeKey;
  from?: string; // YYYY-MM-DD (only when range === "custom")
  to?: string;   // YYYY-MM-DD (only when range === "custom")
  type: "all" | "income" | "expense";
  category: string; // "all" or specific
  search: string;
};

export function getDateRange(
  range: DateRangeKey,
  from?: string,
  to?: string
): { start: Date | null; end: Date | null } {
  const now = new Date();

  switch (range) {
    case "this-month":
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
      };
    case "last-month": {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      return { start, end };
    }
    case "last-3-months":
      return {
        start: new Date(now.getFullYear(), now.getMonth() - 2, 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
      };
    case "this-year":
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end: new Date(now.getFullYear(), 11, 31, 23, 59, 59),
      };
    case "custom": {
      if (!from || !to) return { start: null, end: null };
      return {
        start: new Date(from),
        end: new Date(to + "T23:59:59"),
      };
    }
    case "all-time":
    default:
      return { start: null, end: null };
  }
}

export function applyFilters(
  transactions: Transaction[],
  filters: ReportFilters
): Transaction[] {
  const { start, end } = getDateRange(
    filters.range,
    filters.from,
    filters.to
  );

  return transactions.filter((t) => {
    const date = new Date(t.transaction_date);

    if (start && date < start) return false;
    if (end && date > end) return false;
    if (filters.type !== "all" && t.type !== filters.type) return false;
    if (
      filters.category !== "all" &&
      t.category !== filters.category
    )
      return false;

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      const haystack = `${t.description || ""} ${t.category}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });
}

export function transactionsToCSV(transactions: Transaction[]): string {
  const headers = [
    "Date",
    "Type",
    "Category",
    "Description",
    "Amount",
  ];

  const rows = transactions.map((t) => [
    t.transaction_date,
    t.type,
    t.category,
    (t.description || "").replace(/"/g, '""'),
    Number(t.amount).toFixed(2),
  ]);

  const escape = (val: string) =>
    /[",\n]/.test(val) ? `"${val}"` : val;

  const csv = [
    headers.join(","),
    ...rows.map((r) => r.map((c) => escape(String(c))).join(",")),
  ].join("\n");

  return csv;
}