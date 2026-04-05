export function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="panel">
      <div style={{ color: "#6b7280", fontSize: 13 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
    </div>
  );
}
