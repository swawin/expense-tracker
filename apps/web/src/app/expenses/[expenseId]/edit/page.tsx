"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { getExpense, updateExpense } from "@/lib/api/expenses";

export default function EditExpensePage() {
  const params = useParams<{ expenseId: string }>();
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["expense", params.expenseId],
    queryFn: () => getExpense(params.expenseId)
  });

  if (!data) return <div className="panel">Loading expense...</div>;

  return (
    <div>
      <PageHeader title="Edit Expense" />
      <ExpenseForm
        defaultValue={data}
        submitLabel="Update Expense"
        onSubmit={async (payload) => {
          await updateExpense(params.expenseId, payload);
          router.push("/expenses");
        }}
      />
    </div>
  );
}
