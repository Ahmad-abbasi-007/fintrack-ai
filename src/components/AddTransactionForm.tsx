"use client";

import { useState } from "react";
import { addTransaction } from "@/app/dashboard/actions";
import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  type TransactionType,
} from "@/lib/types";

export default function AddTransactionForm() {
  const [type, setType] = useState<TransactionType>("expense");
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories =
    type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function handleTypeChange(newType: TransactionType) {
    setType(newType);
    const list =
      newType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    setCategory(list[0]);
    setCustomCategory("");
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    if (category === "Other") {
      const trimmed = customCategory.trim();
      if (!trimmed) {
        setError("Please describe your custom category.");
        setLoading(false);
        return;
      }
      formData.set("category", trimmed);
    }

    try {
      await addTransaction(formData);
      const form = document.getElementById(
        "add-transaction-form"
      ) as HTMLFormElement;
      form?.reset();
      setCustomCategory("");
      setCategory(
        type === "income" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]
      );
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

      {/* Type toggle */}
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
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {category === "Other" && (
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Custom Category
            </label>
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="e.g. Gym membership, Pet supplies..."
              required
              className="w-full bg-gray-950 border border-emerald-500/40 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Type what this transaction is really for.
            </p>
          </div>
        )}

        {/* Date field with custom emerald calendar icon */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Date</label>
          <div className="relative">
            <input
              type="date"
              name="transaction_date"
              required
              defaultValue={new Date().toISOString().split("T")[0]}
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
            placeholder="e.g. Grocery shopping"
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold py-2.5 rounded-lg disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Transaction"}
        </button>
      </form>
    </div>
  );
}