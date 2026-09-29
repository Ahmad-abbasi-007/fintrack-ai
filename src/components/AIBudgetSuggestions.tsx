"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  suggestBudgets,
  applyBudgetSuggestions,
  type BudgetSuggestion,
} from "@/app/dashboard/budget-ai-actions";
import { formatCurrency } from "@/lib/currency";

export default function AIBudgetSuggestions() {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<BudgetSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [applying, startApply] = useTransition();
  const [error, setError] = useState("");
  const [applied, setApplied] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setApplied(false);
    try {
      const result = await suggestBudgets();
      if (result.length === 0) {
        setError(
          "Not enough spending history yet. Add at least 5 expense transactions over the last 3 months."
        );
      }
      setSuggestions(result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleApplyAll() {
    startApply(async () => {
      try {
        await applyBudgetSuggestions(suggestions);
        setApplied(true);
        setTimeout(() => {
          router.refresh();
          setSuggestions([]);
        }, 900);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to apply");
      }
    });
  }

  return (
    <div className="bg-gradient-to-br from-violet-500/5 to-blue-500/5 border border-violet-500/20 rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          <div>
            <h3 className="text-lg font-semibold">AI Budget Suggestions</h3>
            <p className="text-xs text-gray-400">
              Let AI set smart monthly limits based on your last 3 months.
            </p>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading || applying}
          className="bg-violet-500 hover:bg-violet-600 text-white font-semibold text-sm px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Suggest Budgets"}
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
          {error}
        </p>
      )}

      {applied && (
        <p className="text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 mb-4">
          ✅ Suggestions applied! Your budgets have been created/updated.
        </p>
      )}

      {loading && (
        <div className="flex items-center gap-3 text-gray-400 text-sm py-4">
          <span className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          AI is analyzing your spending patterns...
        </div>
      )}

      {!loading && suggestions.length > 0 && (
        <>
          <div className="space-y-3 mb-4">
            {suggestions.map((s, i) => (
              <div
                key={i}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-start justify-between gap-4 flex-wrap"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold mb-1">{s.category}</p>
                  <p className="text-xs text-gray-400">{s.reason}</p>
                </div>
                <p className="text-lg font-bold text-violet-400 shrink-0">
                  {formatCurrency(s.suggested_limit)}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={handleApplyAll}
            disabled={applying}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold py-2.5 rounded-lg disabled:opacity-50"
          >
            {applying ? "Applying..." : `Apply All ${suggestions.length} Budgets`}
          </button>
        </>
      )}

      {!loading && !error && suggestions.length === 0 && !applied && (
        <p className="text-gray-400 text-sm">
          Click <strong className="text-violet-400">Suggest Budgets</strong>{" "}
          and AI will analyze your last 3 months to recommend realistic limits.
        </p>
      )}
    </div>
  );
}