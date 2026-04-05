"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { createExpense } from "@/lib/api/expenses";
import { getReports } from "@/lib/api/reports";

export default function NewExpensePage() {
  const router = useRouter();
  const { data: reports } = useQuery({
    queryKey: ["reports"],
    queryFn: getReports
  });

  if (!reports) return <div className="panel">Loading reports...</div>;

  return (
    <div>
      <PageHeader title="Create Expense" />
      <ExpenseForm
        reports={reports}
        onSubmit={async (payload) => {
          await createExpense(payload);
          router.push("/expenses");
        }}
      />
    </div>
  );
}
