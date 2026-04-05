import { Expense } from "@expense-tracker/shared";
import { apiFetch } from "./client";

export function getExpenses(status?: string) {
  const query = status ? `?status=${status}` : "";
  return apiFetch<Expense[]>(`/expenses${query}`);
}

export function getExpense(expenseId: string) {
  return apiFetch<Expense>(`/expenses/${expenseId}`);
}

export function createExpense(payload: Partial<Expense>) {
  return apiFetch<Expense>("/expenses", { method: "POST", body: JSON.stringify(payload) });
}

export function updateExpense(expenseId: string, payload: Partial<Expense>) {
  return apiFetch<Expense>(`/expenses/${expenseId}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export function deleteExpense(expenseId: string) {
  return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1"}/expenses/${expenseId}`, { method: "DELETE" });
}
