import { AnalyzeConsole } from "@/components/AnalyzeConsole";
import { ProtectedShell } from "@/components/ProtectedShell";

export default function AnalyzePage() {
  return (
    <ProtectedShell>
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">URL Analyzer</h1>
        <AnalyzeConsole />
      </section>
    </ProtectedShell>
  );
}
