"use client";

import Link from "next/link";
import { Expense } from "@expense-tracker/shared";
import { formatMoney } from "@/lib/utils/currency";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function ExpensesTable({ expenses }: { expenses: Expense[] }) {
  return (
    <div className="panel">
      <table className="table">
        <thead>
          <tr>
            <th>Date</th><th>Merchant</th><th>Category</th><th>Amount</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp._id}>
              <td>{new Date(exp.date).toLocaleDateString()}</td>
              <td>{exp.merchant}</td>
              <td>{exp.category}</td>
              <td>{formatMoney(exp.amountCents, exp.currency)}</td>
              <td><StatusBadge status={exp.status} /></td>
              <td><Link href={`/expenses/${exp._id}/edit`}>Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
