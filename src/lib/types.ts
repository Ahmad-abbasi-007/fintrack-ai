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
  account_id: string | null;             
  is_transfer: boolean;                  
  transfer_to_account_id: string | null; 
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

export type UserSettings = {
  id: string;
  user_id: string;
  theme: "dark" | "light" | "system";
  currency: string;
  language: string;
  budget_alerts: boolean;
  recurring_reminders: boolean;
  created_at: string;
  updated_at: string;
};

export type CurrencyOption = {
  code: string;
  symbol: string;
  label: string;
};

export type Goal = {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  saved_amount: number;
  deadline: string | null;
  icon: string;
  color: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type GoalContribution = {
  id: string;
  goal_id: string;
  user_id: string;
  amount: number;
  note: string | null;
  created_at: string;
};

export const GOAL_ICONS = [
  "🎯",
  "💻",
  "🏠",
  "🚗",
  "✈️",
  "🎓",
  "💍",
  "📱",
  "🎮",
  "🏖️",
  "💰",
  "🎁",
];

export const GOAL_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", bar: "bg-emerald-500" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", bar: "bg-blue-500" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", bar: "bg-violet-500" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-400", bar: "bg-pink-500" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", bar: "bg-amber-500" },
  red: { bg: "bg-red-500/10", text: "text-red-400", bar: "bg-red-500" },
};


export type Bill = {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  category: string;
  due_date: string;
  is_paid: boolean;
  paid_at: string | null;
  recurrence: "monthly" | "yearly" | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export const BILL_CATEGORIES = [
  "Bills",
  "Rent",
  "Utilities",
  "Internet",
  "Phone",
  "Insurance",
  "Subscriptions",
  "Loan",
  "Other",
];

export type AccountType = "cash" | "bank" | "card" | "wallet" | "other";

export type Account = {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  initial_balance: number;
  color: string;
  icon: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
};

export type AccountWithBalance = Account & {
  current_balance: number;
  income_total: number;
  expense_total: number;
};

export const ACCOUNT_TYPES: {
  value: AccountType;
  label: string;
  icon: string;
}[] = [
  { value: "cash", label: "Cash", icon: "💵" },
  { value: "bank", label: "Bank", icon: "🏦" },
  { value: "card", label: "Card", icon: "💳" },
  { value: "wallet", label: "Wallet", icon: "👛" },
  { value: "other", label: "Other", icon: "💰" },
];

export const ACCOUNT_ICONS = [
  "💵",
  "🏦",
  "💳",
  "👛",
  "💰",
  "🏧",
  "📱",
  "💎",
  "🎁",
  "🏢",
];

export const ACCOUNT_COLORS: Record<
  string,
  { bg: string; text: string; bar: string }
> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", bar: "bg-emerald-500" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", bar: "bg-blue-500" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", bar: "bg-violet-500" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-400", bar: "bg-pink-500" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", bar: "bg-amber-500" },
  red: { bg: "bg-red-500/10", text: "text-red-400", bar: "bg-red-500" },
  teal: { bg: "bg-teal-500/10", text: "text-teal-400", bar: "bg-teal-500" },
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", bar: "bg-cyan-500" },
};