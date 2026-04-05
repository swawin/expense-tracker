"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getExpenses } from "@/lib/api/expenses";
import { PageHeader } from "@/components/ui/PageHeader";
import { ExpensesTable } from "@/components/expenses/ExpensesTable";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ExpensesPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ["expenses"], queryFn: () => getExpenses() });

  return (
    <div>
      <PageHeader
        title="Expenses"
        action={<Link className="btn btn-primary" href="/expenses/new">New Expense</Link>}
      />
      {isLoading && <div className="panel">Loading expenses...</div>}
      {error && <div className="panel">Failed to load expenses</div>}
      {data && data.length > 0 ? <ExpensesTable expenses={data} /> : !isLoading && <EmptyState message="No expenses yet. Create your first expense." />}
    </div>
  );
}
