"use client";

import { EXPENSE_CATEGORIES } from "@expense-tracker/shared";
import { Report } from "@expense-tracker/shared";

type FormPayload = {
  date: string;
  merchant: string;
  amountCents: number;
  currency: string;
  category: string;
  description?: string;
  reportId?: string | null;
};

export function ExpenseForm({
  defaultValue,
  reports,
  onSubmit,
  submitLabel = "Save Expense"
}: {
  defaultValue?: Partial<FormPayload>;
  reports: Report[];
  onSubmit: (payload: FormPayload) => Promise<void>;
  submitLabel?: string;
}) {
  async function handleSubmit(formData: FormData) {
    const reportId = String(formData.get("reportId") || "");
    await onSubmit({
      date: new Date(formData.get("date") as string).toISOString(),
      merchant: String(formData.get("merchant") || ""),
      amountCents: Number(formData.get("amountCents") || 0),
      currency: String(formData.get("currency") || "USD"),
      category: String(formData.get("category") || "Other"),
      description: String(formData.get("description") || ""),
      reportId: reportId ? reportId : null
    });
  }

  return (
    <form className="panel form" action={handleSubmit}>
      <input className="input" type="date" name="date" defaultValue={defaultValue?.date?.slice(0, 10)} required />
      <input className="input" name="merchant" placeholder="Merchant" defaultValue={defaultValue?.merchant} required />
      <input className="input" name="amountCents" type="number" min={1} placeholder="Amount (in cents)" defaultValue={defaultValue?.amountCents} required />
      <select className="select" name="category" defaultValue={defaultValue?.category ?? "Other"}>
        {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <select className="select" name="reportId" defaultValue={defaultValue?.reportId ?? ""}>
        <option value="">No report</option>
        {reports.map((report) => (
          <option key={report._id} value={report._id}>
            {report.title}
          </option>
        ))}
      </select>
      <input className="input" name="currency" defaultValue={defaultValue?.currency ?? "USD"} maxLength={3} required />
      <textarea className="textarea" name="description" placeholder="Description" defaultValue={defaultValue?.description} />
      <button className="btn btn-primary" type="submit">{submitLabel}</button>
    </form>
  );
}
