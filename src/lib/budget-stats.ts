import type { Budget, BudgetStatus, Transaction } from "@/lib/types";

export function getCurrentMonthTransactions(
  transactions: Transaction[]
): Transaction[] {
  const now = new Date();
  return transactions.filter((t) => {
    const d = new Date(t.transaction_date);
    return (
      d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    );
  });
}

export function getBudgetStatuses(
  budgets: Budget[],
  transactions: Transaction[]
): BudgetStatus[] {
  const currentMonth = getCurrentMonthTransactions(transactions);

  return budgets.map((budget) => {
    const spent = currentMonth
      .filter(
        (t) => t.type === "expense" && t.category === budget.category
      )
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const limit = Number(budget.monthly_limit);
    const remaining = Math.max(limit - spent, 0);
    const percent = limit > 0 ? (spent / limit) * 100 : 0;

    let state: BudgetStatus["state"] = "safe";
    if (percent >= 100) state = "exceeded";
    else if (percent >= 80) state = "warning";

    return {
      budget,
      spent,
      remaining,
      percent,
      state,
    };
  });
}