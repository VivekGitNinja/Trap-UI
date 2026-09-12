import { ProtectedShell } from "@/components/ProtectedShell";
import { ReportsList } from "@/components/ReportsList";

export default function ReportsPage() {
  return (
    <ProtectedShell>
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">Saved Reports</h1>
        <ReportsList />
      </section>
    </ProtectedShell>
  );
}
