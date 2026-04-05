import { Report } from "@expense-tracker/shared";
import { apiFetch } from "./client";

export interface ReportDetail extends Report {
  expenses: Array<{
    _id: string;
    merchant: string;
    amountCents: number;
    date: string;
    status: "reported";
    category: string;
  }>;
}

export function getReports() {
  return apiFetch<Report[]>("/reports");
}

export function getReport(reportId: string) {
  return apiFetch<ReportDetail>(`/reports/${reportId}`);
}

export function createReport(payload: Pick<Report, "title" | "description" | "currency">) {
  return apiFetch<Report>("/reports", { method: "POST", body: JSON.stringify(payload) });
}

export function addExpensesToReport(reportId: string, expenseIds: string[]) {
  return apiFetch<Report>(`/reports/${reportId}/expenses`, { method: "POST", body: JSON.stringify({ expenseIds }) });
}

export function removeExpenseFromReport(reportId: string, expenseId: string) {
  return apiFetch<Report>(`/reports/${reportId}/expenses/${expenseId}`, { method: "DELETE" });
}

export function submitReport(reportId: string) {
  return apiFetch<Report>(`/reports/${reportId}/submit`, { method: "POST" });
}
