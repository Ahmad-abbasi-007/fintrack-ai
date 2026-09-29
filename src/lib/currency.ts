// Supported currencies
export const CURRENCIES: Record<
  string,
  { symbol: string; code: string; label: string }
> = {
  PKR: { symbol: "Rs.", code: "PKR", label: "Pakistani Rupee" },
  USD: { symbol: "$", code: "USD", label: "US Dollar" },
  EUR: { symbol: "€", code: "EUR", label: "Euro" },
  GBP: { symbol: "£", code: "GBP", label: "British Pound" },
  INR: { symbol: "₹", code: "INR", label: "Indian Rupee" },
  AED: { symbol: "د.إ", code: "AED", label: "UAE Dirham" },
  SAR: { symbol: "﷼", code: "SAR", label: "Saudi Riyal" },
};

// Default symbol (used server-side when user preference isn't known)
export const CURRENCY_SYMBOL = "Rs.";
export const CURRENCY_CODE = "PKR";

/**
 * Format amount with currency symbol.
 * Pass a currency code to override the default.
 * @example formatCurrency(1234.5, "USD") → "$ 1,234.50"
 */
export function formatCurrency(
  amount: number | string,
  currencyCode: string = CURRENCY_CODE
): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return `${CURRENCIES[currencyCode]?.symbol || CURRENCY_SYMBOL} 0.00`;

  const symbol = CURRENCIES[currencyCode]?.symbol || CURRENCY_SYMBOL;

  const formatted = num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${symbol} ${formatted}`;
}

/**
 * Format with +/- prefix.
 */
export function formatSignedCurrency(
  amount: number | string,
  type: "income" | "expense",
  currencyCode: string = CURRENCY_CODE
): string {
  const prefix = type === "income" ? "+" : "-";
  return `${prefix} ${formatCurrency(amount, currencyCode)}`;
}