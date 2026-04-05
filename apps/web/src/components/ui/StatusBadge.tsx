import { ExpenseStatus, ReportStatus } from "@expense-tracker/shared";

export function StatusBadge({ status }: { status: ExpenseStatus | ReportStatus }) {
  return <span className={`badge ${status}`}>{status}</span>;
}
