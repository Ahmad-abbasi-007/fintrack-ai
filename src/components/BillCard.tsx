import {
  deleteBill,
  markBillPaid,
} from "@/app/dashboard/bill-actions";
import type { Bill } from "@/lib/types";
import { formatCurrency } from "@/lib/currency";

export default function BillCard({ bill }: { bill: Bill }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(bill.due_date);
  due.setHours(0, 0, 0, 0);

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysUntil = Math.round((due.getTime() - today.getTime()) / msPerDay);

  const isOverdue = !bill.is_paid && daysUntil < 0;
  const isDueToday = !bill.is_paid && daysUntil === 0;
  const isSoon = !bill.is_paid && daysUntil > 0 && daysUntil <= 3;

  const borderColor = bill.is_paid
    ? "border-gray-800"
    : isOverdue
    ? "border-red-500/40"
    : isDueToday
    ? "border-amber-500/40"
    : isSoon
    ? "border-amber-500/20"
    : "border-gray-800";

  const dueLabel = bill.is_paid
    ? `Paid on ${new Date(bill.paid_at || bill.due_date).toLocaleDateString()}`
    : isOverdue
    ? `Overdue by ${Math.abs(daysUntil)} day${Math.abs(daysUntil) === 1 ? "" : "s"}`
    : isDueToday
    ? "Due today"
    : daysUntil === 1
    ? "Due tomorrow"
    : `Due in ${daysUntil} days`;

  const dueColor = bill.is_paid
    ? "text-gray-400"
    : isOverdue
    ? "text-red-400"
    : isDueToday || isSoon
    ? "text-amber-400"
    : "text-gray-400";

  return (
    <div
      className={`bg-gray-900 border ${borderColor} rounded-2xl p-5 transition`}
    >
      <div className="flex items-start justify-between mb-3 gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p
              className={`font-semibold truncate ${
                bill.is_paid ? "line-through text-gray-500" : ""
              }`}
            >
              {bill.name}
            </p>
            {bill.recurrence && !bill.is_paid && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
                🔁 {bill.recurrence}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {bill.category} • Due{" "}
            {new Date(bill.due_date).toLocaleDateString()}
          </p>
        </div>

        <p
          className={`font-semibold shrink-0 ${
            bill.is_paid ? "text-gray-500 line-through" : "text-white"
          }`}
        >
          {formatCurrency(bill.amount)}
        </p>
      </div>

      <p className={`text-xs mb-3 ${dueColor}`}>{dueLabel}</p>

      {bill.notes && (
        <p className="text-xs text-gray-500 mb-3 truncate">📝 {bill.notes}</p>
      )}

      <div className="flex gap-2">
        <form action={markBillPaid} className="flex-1">
          <input type="hidden" name="id" value={bill.id} />
          <input
            type="hidden"
            name="paid"
            value={bill.is_paid ? "false" : "true"}
          />
          <button
            type="submit"
            className={`w-full text-xs font-semibold py-2 rounded-lg transition ${
              bill.is_paid
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                : "bg-emerald-500 hover:bg-emerald-600 text-black"
            }`}
          >
            {bill.is_paid ? "↺ Mark Unpaid" : "✓ Mark as Paid"}
          </button>
        </form>

        <form action={deleteBill}>
          <input type="hidden" name="id" value={bill.id} />
          <button
            type="submit"
            className="text-xs px-3 py-2 rounded-lg bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition"
            title="Delete bill"
          >
            ✕
          </button>
        </form>
      </div>
    </div>
  );
}