"use client";

type Payload = { title: string; description?: string; currency: string };

export function ReportForm({ onSubmit }: { onSubmit: (payload: Payload) => Promise<void> }) {
  async function handleSubmit(formData: FormData) {
    await onSubmit({
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || ""),
      currency: String(formData.get("currency") || "USD")
    });
  }

  return (
    <form className="panel form" action={handleSubmit}>
      <input className="input" name="title" placeholder="Report title" required />
      <textarea className="textarea" name="description" placeholder="Description" />
      <input className="input" name="currency" defaultValue="USD" maxLength={3} required />
      <button type="submit" className="btn btn-primary">Create Report</button>
    </form>
  );
}
