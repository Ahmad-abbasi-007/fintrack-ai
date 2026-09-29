"use client";

import { useState } from "react";
import {
  contributeToGoal,
  deleteGoal,
} from "@/app/dashboard/goal-actions";
import { GOAL_COLORS } from "@/lib/types";
import type { GoalStatus } from "@/lib/goal-stats";
import { formatCurrency } from "@/lib/currency";

export default function GoalCard({ status }: { status: GoalStatus }) {
  const { goal, percent, remaining, daysLeft, monthlyNeeded, state } = status;
  const c = GOAL_COLORS[goal.color] || GOAL_COLORS.emerald;

  const [contribOpen, setContribOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleContribute(formData: FormData) {
    setLoading(true);
    setError("");
    try {
      await contributeToGoal(formData);
      setAmount("");
      setNote("");
      setContribOpen(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  const daysLabel =
    daysLeft === null
      ? null
      : daysLeft < 0
      ? `${Math.abs(daysLeft)} days overdue`
      : daysLeft === 0
      ? "Due today"
      : daysLeft === 1
      ? "1 day left"
      : `${daysLeft} days left`;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-12 h-12 rounded-xl ${c.bg} ${c.text} flex items-center justify-center text-2xl shrink-0`}
          >
            {goal.icon}
          </div>
          <div className="min-w-0">
            <p className="font-semibold truncate">{goal.name}</p>
            {daysLabel && (
              <p
                className={`text-xs ${
                  daysLeft !== null && daysLeft < 0
                    ? "text-red-400"
                    : daysLeft !== null && daysLeft <= 7
                    ? "text-amber-400"
                    : "text-gray-400"
                }`}
              >
                {daysLabel}
              </p>
            )}
          </div>
        </div>

        {!goal.is_completed && (
          <form action={deleteGoal}>
            <input type="hidden" name="id" value={goal.id} />
            <button
              type="submit"
              className="text-gray-500 hover:text-red-400 text-sm"
              title="Delete goal"
            >
              ✕
            </button>
          </form>
        )}
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex items-baseline justify-between text-sm mb-2">
          <span className="text-gray-400">
            <span className={`font-semibold ${c.text}`}>
              {formatCurrency(goal.saved_amount)}
            </span>{" "}
            / {formatCurrency(goal.target_amount)}
          </span>
          <span className={`text-xs font-medium ${c.text}`}>
            {percent.toFixed(0)}%
          </span>
        </div>
        <div className="h-2.5 bg-gray-950 rounded-full overflow-hidden">
          <div
            className={`h-full ${c.bar} transition-all duration-500`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Info row */}
      <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
        <span>{formatCurrency(remaining)} to go</span>
        {monthlyNeeded !== null && remaining > 0 && (
          <span className="text-amber-400">
            Save {formatCurrency(monthlyNeeded)}/mo
          </span>
        )}
      </div>

      {/* Completion badge */}
      {goal.is_completed && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-center mb-3">
          <p className="text-emerald-400 text-sm font-medium">
            🎉 Goal Achieved!
          </p>
        </div>
      )}

      {/* Contribute */}
      {!goal.is_completed && !contribOpen && (
        <button
          onClick={() => setContribOpen(true)}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-sm py-2 rounded-lg"
        >
          + Add Contribution
        </button>
      )}

      {contribOpen && (
        <form
          action={handleContribute}
          className="bg-gray-950 border border-gray-800 rounded-lg p-4 space-y-3"
        >
          <input type="hidden" name="goal_id" value={goal.id} />

          <div>
            <label className="block text-xs text-gray-400 mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              step="0.01"
              min="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Note <span className="text-gray-600">(optional)</span>
            </label>
            <input
              type="text"
              name="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Monthly savings"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-sm py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add"}
            </button>
            <button
              type="button"
              onClick={() => setContribOpen(false)}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}