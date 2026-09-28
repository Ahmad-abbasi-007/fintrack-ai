"use client";

import { useState } from "react";
import { upsertBudget } from "@/app/dashboard/budget-actions";
import { EXPENSE_CATEGORIES } from "@/lib/types";

export default function BudgetForm({
  existingCategories,
}: {
  existingCategories: string[];
}) {
  const [category, setCategory] = useState(
    EXPENSE_CATEGORIES.filter((c) => c !== "Other")[0]
  );
  const [limit, setLimit] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    try {
      await upsertBudget(formData);
      setLimit("");
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const isUpdate = existingCategories.includes(category);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">
        {isUpdate ? "Update Budget" : "Set Budget"}
      </h3>

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Category</label>
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500"
          >
            {EXPENSE_CATEGORIES.filter((c) => c !== "Other").map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Monthly Limit ($)
          </label>
          <input
            type="number"
            name="monthly_limit"
            step="0.01"
            min="1"
            required
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            placeholder="e.g. 500"
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
          {loading
            ? "Saving..."
            : isUpdate
            ? "Update Budget"
            : "Set Budget"}
        </button>
      </form>
    </div>
  );
}