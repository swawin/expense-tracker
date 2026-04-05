export type ExpenseStatus = "unreported" | "reported";
export type ReportStatus = "draft" | "submitted";

export interface Expense {
  _id: string;
  date: string;
  merchant: string;
  amountCents: number;
  currency: string;
  category: string;
  description?: string;
  status: ExpenseStatus;
  reportId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  _id: string;
  title: string;
  description?: string;
  status: ReportStatus;
  submittedAt?: string | null;
  expenseIds: string[];
  totalAmountCents: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export const EXPENSE_CATEGORIES = [
  "Meals",
  "Travel",
  "Lodging",
  "Transportation",
  "Office",
  "Software",
  "Other"
] as const;
