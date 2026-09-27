export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string | null;
  transaction_date: string;
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