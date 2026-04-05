import { ExpenseStatus, ReportStatus } from "@expense-tracker/shared";

export function StatusBadge({ status }: { status: ExpenseStatus | ReportStatus }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={`badge ${status}`}>{label}</span>;
}
