import { ReactNode } from "react";

export function PageHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="page-header">
      <h1 style={{ margin: 0 }}>{title}</h1>
      {action}
    </div>
  );
}
