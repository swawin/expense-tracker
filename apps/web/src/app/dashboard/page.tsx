"use client";

import { useQuery } from "@tanstack/react-query";
import { getExpenses } from "@/lib/api/expenses";
import { getReports } from "@/lib/api/reports";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { formatMoney } from "@/lib/utils/currency";

export default function DashboardPage() {
  const expensesQuery = useQuery({ queryKey: ["expenses"], queryFn: () => getExpenses() });
  const reportsQuery = useQuery({ queryKey: ["reports"], queryFn: getReports });

  const expenses = expensesQuery.data ?? [];
  const reports = reportsQuery.data ?? [];
  const unreported = expenses.filter((e) => e.status === "unreported");
  const submittedReports = reports.filter((r) => r.status === "submitted");

  return (
    <div>
      <PageHeader title="Dashboard" />
      <div className="grid grid-3">
        <SummaryCard title="Total Expenses" value={String(expenses.length)} />
        <SummaryCard title="Unreported Expenses" value={String(unreported.length)} />
        <SummaryCard title="Submitted Reports" value={String(submittedReports.length)} />
      </div>
      <div className="panel" style={{ marginTop: 16 }}>
        <p style={{ margin: 0 }}>Unreported amount: {formatMoney(unreported.reduce((sum, exp) => sum + exp.amountCents, 0))}</p>
      </div>
    </div>
  );
}
