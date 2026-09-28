"use client";

import type { Transaction } from "@/lib/types";
import { transactionsToCSV } from "@/lib/report-filters";

export default function ExportCSVButton({
  transactions,
  filename = "fintrack-export.csv",
}: {
  transactions: Transaction[];
  filename?: string;
}) {
  function handleExport() {
    const csv = transactionsToCSV(transactions);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      disabled={transactions.length === 0}
      className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-semibold text-sm px-4 py-2 rounded-lg flex items-center gap-2"
    >
      ⬇️ Export CSV
      <span className="text-xs opacity-70">({transactions.length})</span>
    </button>
  );
}