"use client";

import { useState } from "react";
import { transferBetweenAccounts } from "@/app/dashboard/account-actions";
import type { Account } from "@/lib/types";
import { CURRENCY_SYMBOL } from "@/lib/currency";

export default function TransferForm({ accounts }: { accounts: Account[] }) {
  const [fromId, setFromId] = useState(accounts[0]?.id || "");
  const [toId, setToId] = useState(accounts[1]?.id || "");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (accounts.length < 2) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
        <p className="text-4xl mb-3">🔄</p>
        <p className="text-sm text-gray-400">
          Add at least 2 accounts to enable transfers.
        </p>
      </div>
    );
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await transferBetweenAccounts(formData);
      setAmount("");
      setDescription("");
      setSuccess("Transfer complete ✅");
      setTimeout(() => setSuccess(""), 2500);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">🔄 Transfer Between Accounts</h3>

      <form action={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-300 mb-1">From</label>
            <select
              name="from_account_id"
              value={fromId}
              onChange={(e) => setFromId(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.icon} {a.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">To</label>
            <select
              name="to_account_id"
              value={toId}
              onChange={(e) => setToId(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
            >
              {accounts
                .filter((a) => a.id !== fromId)
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.icon} {a.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Amount ({CURRENCY_SYMBOL})
          </label>
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
          <label className="block text-sm text-gray-300 mb-1">
            Note <span className="text-gray-500">(optional)</span>
          </label>
          <input
            type="text"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Monthly savings"
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Date</label>
          <input
            type="date"
            name="transaction_date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            {error}
          </p>
        )}
        {success && (
          <p className="text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg disabled:opacity-50"
        >
          {loading ? "Transferring..." : "Transfer"}
        </button>
      </form>
    </div>
  );
}