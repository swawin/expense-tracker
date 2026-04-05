"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { addExpensesToReport, getReport, removeExpenseFromReport, submitReport, updateReport } from "@/lib/api/reports";
import { getExpenses } from "@/lib/api/expenses";
import { formatMoney } from "@/lib/utils/currency";

export default function ReportDetailsPage() {
  const params = useParams<{ reportId: string }>();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedExpenseId, setSelectedExpenseId] = useState("");

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

  const saveMutation = useMutation({
    mutationFn: () =>
      updateReport(params.reportId, {
        title: title.trim(),
        description: description.trim(),
        status: "draft"
      }),
    onSuccess: refresh
  });

  const report = reportQuery.data;
  const unreportedExpenses = expensesQuery.data ?? [];

  useEffect(() => {
    if (!report) return;
    setTitle(report.title);
    setDescription(report.description ?? "");
  }, [report]);

  useEffect(() => {
    if (!selectedExpenseId || !unreportedExpenses.some((expense) => expense._id === selectedExpenseId)) {
      setSelectedExpenseId(unreportedExpenses[0]?._id ?? "");
    }
  }, [selectedExpenseId, unreportedExpenses]);

  if (!report) return <div className="panel">Loading report...</div>;

  const isSubmitted = report.status === "submitted";
  const canSave = title.trim().length > 0;
  const canAddExpense = !isSubmitted && selectedExpenseId.length > 0;
  const hasDirtyChanges = title !== report.title || description !== (report.description ?? "");
  const saveButtonLabel = hasDirtyChanges ? "Save Draft" : "Saved as Draft";
  const addOptions = unreportedExpenses.map((expense) => ({
    id: expense._id,
    label: `${expense.merchant} — ${formatMoney(expense.amountCents, expense.currency)}`
  }));

  return (
    <div>
      <PageHeader
        title={report.title}
        action={!isSubmitted ? (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn btn-secondary"
              disabled={!canSave || saveMutation.isPending}
              onClick={() => saveMutation.mutate()}
            >
              {saveMutation.isPending ? "Saving..." : saveButtonLabel}
            </button>
            <button className="btn btn-primary" disabled={submitMutation.isPending} onClick={() => submitMutation.mutate()}>
              {submitMutation.isPending ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        ) : undefined}
      />
      <div className="panel" style={{ marginBottom: 16 }}>
        <div className="form" style={{ marginBottom: 16 }}>
          <label>
            <div style={{ marginBottom: 6, fontWeight: 600 }}>Title</div>
            <input
              className="input"
              disabled={isSubmitted}
              maxLength={140}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
          <label>
            <div style={{ marginBottom: 6, fontWeight: 600 }}>Description</div>
            <textarea
              className="textarea"
              disabled={isSubmitted}
              maxLength={500}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>
        </div>
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
          <h3>Add Expense</h3>
          {isSubmitted ? (
            <p>Submitted reports are read-only.</p>
          ) : (
            <>
              {unreportedExpenses.length === 0 && <EmptyState message="No unreported expenses available." />}
              {unreportedExpenses.length > 0 && (
                <div className="form">
                  <label>
                    <div style={{ marginBottom: 6, fontWeight: 600 }}>Select unreported expense</div>
                    <select
                      className="select"
                      value={selectedExpenseId}
                      onChange={(event) => setSelectedExpenseId(event.target.value)}
                    >
                      {addOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    className="btn btn-secondary"
                    disabled={!canAddExpense || addMutation.isPending}
                    onClick={() => addMutation.mutate(selectedExpenseId)}
                  >
                    {addMutation.isPending ? "Adding..." : "Add Expense"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
