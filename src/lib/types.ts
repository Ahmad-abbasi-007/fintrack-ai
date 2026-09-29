export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string | null;
  transaction_date: string;
  is_recurring: boolean;
  recurrence: "weekly" | "monthly" | "yearly" | null;
  next_occurrence: string | null;
  parent_id: string | null;
  created_at: string;
};

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Gift",
  "Other",
];

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Rent",
  "Utilities",
  "Shopping",
  "Health",
  "Entertainment",
  "Education",
  "Bills",
  "Other",
];

export type Budget = {
  id: string;
  user_id: string;
  category: string;
  monthly_limit: number;
  created_at: string;
  updated_at: string;
};

export type BudgetStatus = {
  budget: Budget;
  spent: number;
  remaining: number;
  percent: number;
  state: "safe" | "warning" | "exceeded";
};

export type Category = {
  id: string;
  user_id: string;
  name: string;
  type: "income" | "expense";
  created_at: string;
};

export type RecurrenceFrequency = "weekly" | "monthly" | "yearly";

export type AppNotification = {
  id: string;
  user_id: string;
  type: "info" | "warning" | "danger" | "success";
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
};