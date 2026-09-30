import type { Account, Transaction, AccountWithBalance } from "@/lib/types";

export function getAccountsWithBalance(
  accounts: Account[],
  transactions: Transaction[]
): AccountWithBalance[] {
  return accounts.map((account) => {
    const accountTxns = transactions.filter((t) => {
      // Transfers away from this account reduce balance
      if (t.is_transfer && t.account_id === account.id) return true;
      // Transfers to this account increase balance — we count those separately
      if (t.is_transfer && t.transfer_to_account_id === account.id) return false;
      // Regular transactions
      return t.account_id === account.id;
    });

    const income_total = accountTxns
      .filter((t) => t.type === "income" && !t.is_transfer)
      .reduce((s, t) => s + Number(t.amount), 0);

    const expense_total = accountTxns
      .filter((t) => t.type === "expense" && !t.is_transfer)
      .reduce((s, t) => s + Number(t.amount), 0);

    // Money received via transfers TO this account
    const transfersIn = transactions
      .filter((t) => t.is_transfer && t.transfer_to_account_id === account.id)
      .reduce((s, t) => s + Number(t.amount), 0);

    // Money sent via transfers FROM this account
    const transfersOut = transactions
      .filter((t) => t.is_transfer && t.account_id === account.id)
      .reduce((s, t) => s + Number(t.amount), 0);

    const current_balance =
      Number(account.initial_balance) +
      income_total -
      expense_total +
      transfersIn -
      transfersOut;

    return {
      ...account,
      current_balance,
      income_total,
      expense_total,
    };
  });
}

export function getTotalNetWorth(accounts: AccountWithBalance[]): number {
  return accounts
    .filter((a) => !a.is_archived)
    .reduce((s, a) => s + a.current_balance, 0);
}