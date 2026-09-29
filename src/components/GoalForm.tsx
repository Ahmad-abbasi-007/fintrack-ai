"use client";

import { useState } from "react";
import { addGoal } from "@/app/dashboard/goal-actions";
import { GOAL_ICONS, GOAL_COLORS } from "@/lib/types";
import { CURRENCY_SYMBOL } from "@/lib/currency";

export default function GoalForm() {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [icon, setIcon] = useState("🎯");
  const [color, setColor] = useState("emerald");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    try {
      await addGoal(formData);
      setName("");
      setTarget("");
      setDeadline("");
      setIcon("🎯");
      setColor("emerald");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">Create New Goal</h3>

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Goal Name</label>
          <input
            type="text"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. New Laptop"
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Target Amount ({CURRENCY_SYMBOL})
          </label>
          <input
            type="number"
            name="target_amount"
            step="0.01"
            min="1"
            required
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="e.g. 50000"
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500"
          />
        </div>

                <div>
          <label className="block text-sm text-gray-300 mb-1">
            Deadline <span className="text-gray-500">(optional)</span>
          </label>
          <div className="relative">
            <input
              key={`deadline-${icon}-${color}`}
              type="date"
              name="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
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
          <label className="block text-sm text-gray-300 mb-2">Icon</label>
          <div className="grid grid-cols-6 gap-2">
            {GOAL_ICONS.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIcon(i)}
                className={`aspect-square rounded-lg text-xl transition ${
                  icon === i
                    ? "bg-emerald-500/20 border-2 border-emerald-500"
                    : "bg-gray-950 border border-gray-800 hover:border-gray-600"
                }`}
              >
                {i}
              </button>
            ))}
          </div>
          <input type="hidden" name="icon" value={icon} />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">Color</label>
          <div className="grid grid-cols-6 gap-2">
            {Object.entries(GOAL_COLORS).map(([key, c]) => (
              <button
                key={key}
                type="button"
                onClick={() => setColor(key)}
                className={`aspect-square rounded-lg transition border-2 ${
                  color === key ? "border-white scale-110" : "border-transparent"
                } ${c.bar}`}
              />
            ))}
          </div>
          <input type="hidden" name="color" value={color} />
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
          {loading ? "Creating..." : "Create Goal"}
        </button>
      </form>
    </div>
  );
}