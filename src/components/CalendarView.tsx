"use client";

import { useState } from "react";
import type { Transaction, Bill } from "@/lib/types";
import { formatCurrency } from "@/lib/currency";

type DayCell = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  transactions: Transaction[];
  bills: Bill[];
};

export default function CalendarView({
  transactions,
  bills,
}: {
  transactions: Transaction[];
  bills: Bill[];
}) {
    const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = viewDate.year;
  const month = viewDate.month;

  const firstOfMonth = new Date(year, month, 1);
  const startWeekDay = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const todayStr = new Date().toISOString().split("T")[0];

  // Build cells
  const cells: DayCell[] = [];

  // Previous month trailing days
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = startWeekDay - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthDays - i);
    const ds = d.toISOString().split("T")[0];
    cells.push({
      date: d,
      isCurrentMonth: false,
      isToday: ds === todayStr,
      transactions: transactions.filter((t) => t.transaction_date === ds),
      bills: bills.filter((b) => b.due_date === ds),
    });
  }

  // Current month
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const ds = d.toISOString().split("T")[0];
    cells.push({
      date: d,
      isCurrentMonth: true,
      isToday: ds === todayStr,
      transactions: transactions.filter((t) => t.transaction_date === ds),
      bills: bills.filter((b) => b.due_date === ds),
    });
  }

  // Fill remaining to complete weeks
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      const ds = d.toISOString().split("T")[0];
      cells.push({
        date: d,
        isCurrentMonth: false,
        isToday: ds === todayStr,
        transactions: transactions.filter((t) => t.transaction_date === ds),
        bills: bills.filter((b) => b.due_date === ds),
      });
    }
  }

  function prevMonth() {
    setViewDate((prev) => {
      const d = new Date(prev.year, prev.month - 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  function nextMonth() {
    setViewDate((prev) => {
      const d = new Date(prev.year, prev.month + 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  function today() {
    const d = new Date();
    setViewDate({ year: d.getFullYear(), month: d.getMonth() });
  }

  const selectedCell = selectedDate
    ? cells.find((c) => c.date.toISOString().split("T")[0] === selectedDate)
    : null;

    const monthLabel = new Date(year, month, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="w-9 h-9 rounded-lg bg-gray-950 hover:bg-gray-800 border border-gray-800 transition"
          >
            ←
          </button>
          <h3 className="text-lg font-semibold min-w-[180px] text-center">
            {monthLabel}
          </h3>
          <button
            onClick={nextMonth}
            className="w-9 h-9 rounded-lg bg-gray-950 hover:bg-gray-800 border border-gray-800 transition"
          >
            →
          </button>
        </div>
        <button
          onClick={today}
          className="text-sm bg-gray-950 hover:bg-gray-800 border border-gray-800 rounded-lg px-4 py-2"
        >
          Today
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((d) => (
          <div
            key={d}
            className="text-xs text-gray-500 text-center py-2 font-medium"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          const ds = cell.date.toISOString().split("T")[0];
          const incomeSum = cell.transactions
            .filter((t) => t.type === "income")
            .reduce((s, t) => s + Number(t.amount), 0);
          const expenseSum = cell.transactions
            .filter((t) => t.type === "expense")
            .reduce((s, t) => s + Number(t.amount), 0);
          const hasBills = cell.bills.length > 0;
          const hasOverdue = cell.bills.some(
            (b) => !b.is_paid && b.due_date < todayStr
          );

          return (
            <button
              key={i}
              onClick={() => setSelectedDate(ds)}
              className={`aspect-square rounded-lg p-1.5 text-left transition border ${
                selectedDate === ds
                  ? "bg-emerald-500/10 border-emerald-500"
                  : "border-gray-800 hover:border-gray-700 bg-gray-950"
              } ${!cell.isCurrentMonth ? "opacity-40" : ""}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-xs font-medium ${
                    cell.isToday
                      ? "bg-emerald-500 text-black w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
                      : ""
                  }`}
                >
                  {cell.date.getDate()}
                </span>
                {hasBills && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      hasOverdue ? "bg-red-500" : "bg-amber-500"
                    }`}
                  />
                )}
              </div>
              <div className="space-y-0.5">
                {incomeSum > 0 && (
                  <p className="text-[10px] text-emerald-400 font-medium truncate">
                    +{formatCurrency(incomeSum)}
                  </p>
                )}
                {expenseSum > 0 && (
                  <p className="text-[10px] text-red-400 font-medium truncate">
                    -{formatCurrency(expenseSum)}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Income
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500" /> Expense
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> Bill due
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500" /> Overdue bill
        </span>
      </div>

      {/* Day detail panel */}
      {selectedCell && (
        <div className="mt-6 pt-6 border-t border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">
              {selectedCell.date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h4>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-gray-500 hover:text-white text-sm"
            >
              ✕
            </button>
          </div>

          {selectedCell.transactions.length === 0 &&
            selectedCell.bills.length === 0 && (
              <p className="text-gray-500 text-sm">
                Nothing on this day.
              </p>
            )}

          {selectedCell.bills.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Bills
              </p>
              <div className="space-y-2">
                {selectedCell.bills.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between bg-gray-950 border border-gray-800 rounded-lg p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{b.name}</p>
                      <p className="text-xs text-gray-500">
                        {b.is_paid ? "✅ Paid" : "⏳ Unpaid"}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      {formatCurrency(b.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedCell.transactions.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Transactions
              </p>
              <div className="space-y-2">
                {selectedCell.transactions.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between bg-gray-950 border border-gray-800 rounded-lg p-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {t.description || t.category}
                      </p>
                      <p className="text-xs text-gray-500">{t.category}</p>
                    </div>
                    <p
                      className={`text-sm font-semibold ${
                        t.type === "income"
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {formatCurrency(t.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}