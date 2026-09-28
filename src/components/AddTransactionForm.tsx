"use client";

import { useState, useEffect } from "react";
import { addTransaction } from "@/app/dashboard/actions";
import type { Category, TransactionType } from "@/lib/types";
import type { ReceiptData } from "@/app/dashboard/receipt-actions";

export default function AddTransactionForm({
  categories,
  prefill,
  onPrefillConsumed,
}: {
  categories: Category[];
  prefill: ReceiptData | null;
  onPrefillConsumed: () => void;
}) {
  const [type, setType] = useState<TransactionType>("expense");
  const [category, setCategory] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
    const [isRecurring, setIsRecurring] = useState(false);
  const [recurrence, setRecurrence] = useState<"weekly" | "monthly" | "yearly">(
    "monthly"
  );

  const availableCategories = categories
    .filter((c) => c.type === type)
    .map((c) => c.name);

  // Initialize category once categories load
  useEffect(() => {
    if (!category && availableCategories.length > 0) {
      setCategory(availableCategories[0]);
    }
  }, [availableCategories, category]);

  // Apply AI prefill
  useEffect(() => {
    if (!prefill) return;

    setType(prefill.type);

    // If AI returned a category not in the list, still accept it
    setCategory(prefill.category);
    setAmount(String(prefill.amount));
    setDescription(prefill.description);
    setDate(prefill.transaction_date);
    onPrefillConsumed();
  }, [prefill, onPrefillConsumed]);

  function handleTypeChange(newType: TransactionType) {
    setType(newType);
    const list = categories
      .filter((c) => c.type === newType)
      .map((c) => c.name);
    setCategory(list[0] || "");
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    try {
      await addTransaction(formData);
      setIsRecurring(false);
      setRecurrence("monthly");
      setAmount("");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">Add Transaction</h3>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          type="button"
          onClick={() => handleTypeChange("income")}
          className={`py-2 rounded-lg font-medium transition ${
            type === "income"
              ? "bg-emerald-500 text-black"
              : "bg-gray-950 text-gray-400 hover:text-white"
          }`}
        >
          📈 Income
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange("expense")}
          className={`py-2 rounded-lg font-medium transition ${
            type === "expense"
              ? "bg-red-500 text-white"
              : "bg-gray-950 text-gray-400 hover:text-white"
          }`}
        >
          📉 Expense
        </button>
      </div>

      <form
        id="add-transaction-form"
        action={handleSubmit}
        className="space-y-4"
      >
        <input type="hidden" name="type" value={type} />

        <div>
          <label className="block text-sm text-gray-300 mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            step="0.01"
            min="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Category</label>
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500"
          >
            {availableCategories.length === 0 && (
              <option value="">No categories — add one first</option>
            )}
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Date</label>
          <div className="relative">
            <input
              type="date"
              name="transaction_date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 pr-12 focus:outline-none focus:border-emerald-500"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-emerald-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Description <span className="text-gray-500">(optional)</span>
          </label>
          <input
            type="text"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Grocery shopping"
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500"
          />
        </div>
                <div className="border-t border-gray-800 pt-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_recurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-4 h-4 accent-emerald-500"
            />
            <span className="text-sm text-gray-300">
              🔄 Repeat this transaction
            </span>
          </label>

          {isRecurring && (
            <div className="mt-3">
              <label className="block text-sm text-gray-300 mb-1">
                Repeats
              </label>
              <select
                name="recurrence"
                value={recurrence}
                onChange={(e) =>
                  setRecurrence(
                    e.target.value as "weekly" | "monthly" | "yearly"
                  )
                }
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="weekly">Every Week</option>
                <option value="monthly">Every Month</option>
                <option value="yearly">Every Year</option>
              </select>
            </div>
          )}
        </div>


        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !category}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold py-2.5 rounded-lg disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Transaction"}
        </button>
      </form>
    </div>
  );
}