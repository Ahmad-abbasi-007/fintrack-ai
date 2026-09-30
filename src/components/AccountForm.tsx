"use client";

import { useState } from "react";
import { addAccount } from "@/app/dashboard/account-actions";
import { ACCOUNT_TYPES, ACCOUNT_ICONS, ACCOUNT_COLORS } from "@/lib/types";
import { CURRENCY_SYMBOL } from "@/lib/currency";

export default function AccountForm() {
  const [name, setName] = useState("");
  const [type, setType] = useState("bank");
  const [balance, setBalance] = useState("");
  const [icon, setIcon] = useState("🏦");
  const [color, setColor] = useState("blue");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    try {
      await addAccount(formData);
      setName("");
      setBalance("");
      setIcon("🏦");
      setColor("blue");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">Add Account</h3>

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Name</label>
          <input
            type="text"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. HBL Checking"
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Type</label>
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500"
          >
            {ACCOUNT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.icon} {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Initial Balance ({CURRENCY_SYMBOL})
          </label>
          <input
            type="number"
            name="initial_balance"
            step="0.01"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            placeholder="0.00"
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">Icon</label>
          <div className="grid grid-cols-5 gap-2">
            {ACCOUNT_ICONS.map((i) => (
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
          <div className="grid grid-cols-8 gap-2">
            {Object.entries(ACCOUNT_COLORS).map(([key, c]) => (
              <button
                key={key}
                type="button"
                onClick={() => setColor(key)}
                className={`aspect-square rounded-lg transition border-2 ${
                  color === key
                    ? "border-white scale-110"
                    : "border-transparent"
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
          {loading ? "Adding..." : "Add Account"}
        </button>
      </form>
    </div>
  );
}