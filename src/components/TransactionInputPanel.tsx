"use client";

import { useState } from "react";
import AddTransactionForm from "@/components/AddTransactionForm";
import ReceiptScanner from "@/components/ReceiptScanner";
import type { ReceiptData } from "@/app/dashboard/receipt-actions";

export default function TransactionInputPanel() {
  const [prefill, setPrefill] = useState<ReceiptData | null>(null);
  const [tab, setTab] = useState<"manual" | "scan">("manual");

  function handleExtract(data: ReceiptData) {
    setPrefill(data);
    setTab("manual"); // switch to form tab so user sees the filled data
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-gray-900 border border-gray-800 rounded-xl p-1.5">
        <button
          onClick={() => setTab("manual")}
          className={`py-2 rounded-lg text-sm font-medium transition ${
            tab === "manual"
              ? "bg-emerald-500 text-black"
              : "text-gray-400 hover:text-white"
          }`}
        >
          ✏️ Manual
        </button>
        <button
          onClick={() => setTab("scan")}
          className={`py-2 rounded-lg text-sm font-medium transition ${
            tab === "scan"
              ? "bg-emerald-500 text-black"
              : "text-gray-400 hover:text-white"
          }`}
        >
          📸 Scan Receipt
        </button>
      </div>

      {tab === "manual" ? (
        <AddTransactionForm
          key={prefill ? JSON.stringify(prefill) : "manual"}
          prefill={prefill}
        />
      ) : (
        <ReceiptScanner onExtract={handleExtract} />
      )}
    </div>
  );
}