"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getReports } from "@/lib/api/reports";
import { PageHeader } from "@/components/ui/PageHeader";
import { ReportsTable } from "@/components/reports/ReportsTable";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ReportsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["reports"], queryFn: getReports });

  return (
    <div>
      <PageHeader title="Reports" action={<Link className="btn btn-primary" href="/reports/new">New Report</Link>} />
      {isLoading && <div className="panel">Loading reports...</div>}
      {data && data.length > 0 ? <ReportsTable reports={data} /> : !isLoading && <EmptyState message="No reports yet. Create your first report." />}
    </div>
  );
}
