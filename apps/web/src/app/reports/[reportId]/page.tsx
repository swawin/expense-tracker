"use client";

import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { addExpensesToReport, getReport, removeExpenseFromReport, submitReport } from "@/lib/api/reports";
import { getExpenses } from "@/lib/api/expenses";
import { formatMoney } from "@/lib/utils/currency";

export default function ReportDetailsPage() {
  const params = useParams<{ reportId: string }>();
  const queryClient = useQueryClient();

  const reportQuery = useQuery({ queryKey: ["report", params.reportId], queryFn: () => getReport(params.reportId) });
  const expensesQuery = useQuery({ queryKey: ["unreported-expenses"], queryFn: () => getExpenses("unreported") });

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["report", params.reportId] });
    await queryClient.invalidateQueries({ queryKey: ["expenses"] });
    await queryClient.invalidateQueries({ queryKey: ["unreported-expenses"] });
    await queryClient.invalidateQueries({ queryKey: ["reports"] });
  };

  const addMutation = useMutation({
    mutationFn: async (expenseId: string) => addExpensesToReport(params.reportId, [expenseId]),
    onSuccess: refresh
  });

  const removeMutation = useMutation({
    mutationFn: async (expenseId: string) => removeExpenseFromReport(params.reportId, expenseId),
    onSuccess: refresh
  });

  const submitMutation = useMutation({
    mutationFn: () => submitReport(params.reportId),
    onSuccess: refresh
  });

  const report = reportQuery.data;
  if (!report) return <div className="panel">Loading report...</div>;

  const isSubmitted = report.status === "submitted";

  return (
    <div>
      <PageHeader
        title={report.title}
        action={!isSubmitted ? <button className="btn btn-primary" onClick={() => submitMutation.mutate()}>Submit Report</button> : undefined}
      />
      <div className="panel" style={{ marginBottom: 16 }}>
        <p>Status: <StatusBadge status={report.status} /></p>
        <p>Total: {formatMoney(report.totalAmountCents, report.currency)}</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "2fr 1fr" }}>
        <div className="panel">
          <h3>Linked Expenses</h3>
          {report.expenses.length === 0 && <EmptyState message="No expenses linked to this report yet." />}
          {report.expenses.length > 0 && (
            <table className="table">
              <thead><tr><th>Merchant</th><th>Date</th><th>Amount</th><th /></tr></thead>
              <tbody>
                {report.expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>{expense.merchant}</td>
                    <td>{new Date(expense.date).toLocaleDateString()}</td>
                    <td>{formatMoney(expense.amountCents, report.currency)}</td>
                    <td>{!isSubmitted && <button className="btn btn-secondary" onClick={() => removeMutation.mutate(expense._id)}>Remove</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="panel">
          <h3>Add Unreported</h3>
          {isSubmitted ? (
            <p>Submitted reports are read-only.</p>
          ) : (
            <>
              {(expensesQuery.data ?? []).length === 0 && <EmptyState message="No unreported expenses available." />}
              {(expensesQuery.data ?? []).map((expense) => (
                <div key={expense._id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <div>
                    <div>{expense.merchant}</div>
                    <small>{formatMoney(expense.amountCents, expense.currency)}</small>
                  </div>
                  <button className="btn btn-secondary" onClick={() => addMutation.mutate(expense._id)}>Add</button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
