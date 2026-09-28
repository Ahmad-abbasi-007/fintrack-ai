"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "@/lib/types";

export default function ReportFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const [range, setRange] = useState(params.get("range") || "this-month");
  const [type, setType] = useState(params.get("type") || "all");
  const [category, setCategory] = useState(params.get("category") || "all");
  const [search, setSearch] = useState(params.get("search") || "");
  const [from, setFrom] = useState(params.get("from") || "");
  const [to, setTo] = useState(params.get("to") || "");

  // Sync filters to URL
  useEffect(() => {
    const id = setTimeout(() => {
      const next = new URLSearchParams();
      next.set("range", range);
      next.set("type", type);
      next.set("category", category);
      if (search.trim()) next.set("search", search.trim());
      if (range === "custom") {
        if (from) next.set("from", from);
        if (to) next.set("to", to);
      }
      router.push(`/dashboard/reports?${next.toString()}`);
    }, 300);

    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, type, category, search, from, to]);

  const allCategories = [
    ...EXPENSE_CATEGORIES.filter((c) => c !== "Other"),
    ...INCOME_CATEGORIES.filter((c) => c !== "Other"),
  ].filter((v, i, arr) => arr.indexOf(v) === i);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Range */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Date Range</label>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="last-3-months">Last 3 Months</option>
            <option value="this-year">This Year</option>
            <option value="all-time">All Time</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All</option>
            {allCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Search</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search description..."
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Custom date inputs */}
{range === "custom" && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    <div>
      <label className="block text-xs text-gray-400 mb-1">From</label>
      <div className="relative">
        <input
          key={`from-${range}`}
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:border-emerald-500"
        />
      </div>
    </div>
    <div>
      <label className="block text-xs text-gray-400 mb-1">To</label>
      <div className="relative">
        <input
          key={`to-${range}`}
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:border-emerald-500"
        />
      </div>
    </div>
  </div>
)}
    </div>
  );
}