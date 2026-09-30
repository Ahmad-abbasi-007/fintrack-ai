"use client";

import { useState } from "react";
import {
  archiveAccount,
  deleteAccount,
} from "@/app/dashboard/account-actions";
import { ACCOUNT_COLORS, ACCOUNT_TYPES } from "@/lib/types";
import type { AccountWithBalance } from "@/lib/types";
import { formatCurrency } from "@/lib/currency";

export default function AccountCard({
  account,
}: {
  account: AccountWithBalance;
}) {
  const c = ACCOUNT_COLORS[account.color] || ACCOUNT_COLORS.emerald;
  const typeInfo = ACCOUNT_TYPES.find((t) => t.value === account.type);
  const [showActions, setShowActions] = useState(false);

  const balanceColor =
    account.current_balance >= 0 ? "text-white" : "text-red-400";

  return (
    <div
      className={`bg-gray-900 border border-gray-800 rounded-2xl p-5 relative ${
        account.is_archived ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-12 h-12 rounded-xl ${c.bg} ${c.text} flex items-center justify-center text-2xl shrink-0`}
          >
            {account.icon}
          </div>
          <div className="min-w-0">
            <p className="font-semibold truncate">{account.name}</p>
            <p className="text-xs text-gray-400">
              {typeInfo?.label || account.type}
              {account.is_archived && " • Archived"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowActions((v) => !v)}
          className="text-gray-500 hover:text-white text-sm"
        >
          ⋯
        </button>

        {showActions && (
          <div className="absolute right-4 top-12 bg-gray-950 border border-gray-800 rounded-lg shadow-lg overflow-hidden z-10 w-44">
            <form action={archiveAccount}>
              <input type="hidden" name="id" value={account.id} />
              <input
                type="hidden"
                name="archived"
                value={account.is_archived ? "false" : "true"}
              />
              <button
                type="submit"
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-800"
              >
                {account.is_archived ? "↺ Unarchive" : "📦 Archive"}
              </button>
            </form>
            <form action={deleteAccount}>
              <input type="hidden" name="id" value={account.id} />
              <button
                type="submit"
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800"
              >
                🗑 Delete
              </button>
            </form>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 mb-1">Current Balance</p>
      <p className={`text-2xl font-bold mb-4 ${balanceColor}`}>
        {formatCurrency(account.current_balance)}
      </p>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-2.5">
          <p className="text-gray-500 mb-0.5">Income</p>
          <p className="text-emerald-400 font-semibold">
            {formatCurrency(account.income_total)}
          </p>
        </div>
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-2.5">
          <p className="text-gray-500 mb-0.5">Expense</p>
          <p className="text-red-400 font-semibold">
            {formatCurrency(account.expense_total)}
          </p>
        </div>
      </div>
    </div>
  );
}