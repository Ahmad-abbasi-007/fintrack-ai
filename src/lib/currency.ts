// Change this ONE line to switch currency globally
export const CURRENCY_SYMBOL = "Rs.";
export const CURRENCY_CODE = "PKR";

/**
 * Format a number as currency.
 * @example formatCurrency(1234.5) → "Rs. 1,234.50"
 */
export function formatCurrency(
  amount: number | string | readonly (number | string)[] | undefined
): string {
  const value = Array.isArray(amount) ? amount[0] : amount;
  const num = Number(value);

  if (isNaN(num)) return `${CURRENCY_SYMBOL} 0.00`;

  const formatted = num.toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${CURRENCY_SYMBOL} ${formatted}`;
}

/**
 * Format as signed currency (with + or - prefix).
 * @example formatSignedCurrency(500, "income") → "+ Rs. 500.00"
 */
export function formatSignedCurrency(
  amount: number | string,
  type: "income" | "expense"
): string {
  const prefix = type === "income" ? "+" : "-";
  return `${prefix} ${formatCurrency(amount)}`;
}