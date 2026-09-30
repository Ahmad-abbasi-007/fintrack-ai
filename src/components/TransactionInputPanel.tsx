"use client";

import { useEffect, useState } from "react";
import AddTransactionForm from "@/components/AddTransactionForm";
import ReceiptScanner from "@/components/ReceiptScanner";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/types";
import type { Account } from "@/lib/types";
import type { ReceiptData } from "@/app/dashboard/receipt-actions";

export default function TransactionInputPanel() {
  const supabase = createClient();
    const [accounts, setAccounts] = useState<Account[]>([]);
  const [prefill, setPrefill] = useState<ReceiptData | null>(null);
  const [tab, setTab] = useState<"manual" | "scan">("manual");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    async function load() {
            const { data: accountData } = await supabase
        .from("accounts")
        .select("*")
        .eq("is_archived", false)
        .order("created_at", { ascending: true });

      setAccounts((accountData ?? []) as Account[]);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoadingCats(false);
        return;
      }

      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      setCategories((data ?? []) as Category[]);
      setLoadingCats(false);
    }
    load();
  }, [supabase]);

  function handleExtract(data: ReceiptData) {
    setPrefill(data);
    setTab("manual");
  }

  if (loadingCats) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center text-gray-400 text-sm">
        Loading categories...
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
          categories={categories}
          accounts={accounts}
          prefill={prefill}
          onPrefillConsumed={() => setPrefill(null)}
        />
      ) : (
        <ReceiptScanner onExtract={handleExtract} />
      )}
    </div>
  );
}