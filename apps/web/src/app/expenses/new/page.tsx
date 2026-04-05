"use client";

import { useRouter } from "next/navigation";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { createExpense } from "@/lib/api/expenses";

export default function NewExpensePage() {
  const router = useRouter();

  return (
    <div>
      <PageHeader title="Create Expense" />
      <ExpenseForm
        onSubmit={async (payload) => {
          await createExpense(payload);
          router.push("/expenses");
        }}
      />
    </div>
  );
}
