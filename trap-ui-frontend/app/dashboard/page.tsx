import { DashboardView } from "@/components/DashboardView";
import { ProtectedShell } from "@/components/ProtectedShell";

export default function DashboardPage() {
  return (
    <ProtectedShell>
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
        <DashboardView />
      </section>
    </ProtectedShell>
  );
}
