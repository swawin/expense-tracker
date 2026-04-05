"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { ReportForm } from "@/components/reports/ReportForm";
import { createReport } from "@/lib/api/reports";

export default function NewReportPage() {
  const router = useRouter();

  return (
    <div>
      <PageHeader title="Create Report" />
      <ReportForm
        onSubmit={async (payload) => {
          await createReport(payload);
          router.push("/reports");
        }}
      />
    </div>
  );
}
