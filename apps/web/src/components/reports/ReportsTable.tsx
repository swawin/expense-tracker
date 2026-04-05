"use client";

import Link from "next/link";
import { Report } from "@expense-tracker/shared";
import { formatMoney } from "@/lib/utils/currency";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function ReportsTable({ reports }: { reports: Report[] }) {
  return (
    <div className="panel">
      <table className="table">
        <thead>
          <tr>
            <th>Title</th><th>Total</th><th>Status</th><th>Created</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report._id}>
              <td>{report.title}</td>
              <td>{formatMoney(report.totalAmountCents, report.currency)}</td>
              <td><StatusBadge status={report.status} /></td>
              <td>{new Date(report.createdAt).toLocaleDateString()}</td>
              <td><Link href={`/reports/${report._id}`}>View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
