"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Globe, Share2, Download, CheckCircle, AlertCircle } from "lucide-react";
import { getReport } from "@/lib/api";
import { getToken } from "@/lib/session";
import type { AnalysisResult, Benchmark } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProtectedShell } from "@/components/ProtectedShell";

interface FullReport {
  id: number;
  website_url: string;
  trap_ui_score: number;
  breakdown_json: AnalysisResult;
  industry_tag: string | null;
  created_at: string;
  benchmark: Benchmark | null;
}

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<FullReport | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = getToken();
        const id = Number(params.id);
        const data = await getReport(token || null, id);
        // The API returns the report object merged with the benchmark
        // We need to type cast or adjust based on actual API response structure
        // Looking at getReport implementation: it returns { ...report, benchmark }
        // and report contains breakdown_json.
        setReport(data as unknown as FullReport);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id]);

  if (loading) {
    return (
      <ProtectedShell>
        <div className="flex h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />
        </div>
      </ProtectedShell>
    );
  }

  if (error || !report) {
    return (
      <ProtectedShell>
        <div className="mx-auto max-w-2xl text-center">
          <Card className="border-red-200 bg-red-50 p-8 text-red-700">
            <AlertCircle className="mx-auto mb-4 h-10 w-10" />
            <h2 className="mb-2 text-lg font-bold">Error Loading Report</h2>
            <p>{error || "Report not found"}</p>
            <Button className="mt-6 bg-white text-red-700 hover:bg-red-50" onClick={() => router.back()}>
              Go Back
            </Button>
          </Card>
        </div>
      </ProtectedShell>
    );
  }

  const { breakdown_json: result, benchmark } = report;

  function openGeneratedPreview() {
    if (!result.uiBlueprint) return;
    const previewBlob = new Blob([result.uiBlueprint.implementation.htmlPrototype], { type: "text/html" });
    const previewBlobUrl = URL.createObjectURL(previewBlob);
    window.open(previewBlobUrl, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(previewBlobUrl), 60_000);
  }

  return (
    <ProtectedShell>
      <div className="space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-between gap-4 md:flex-row md:items-center"
        >
          <div className="space-y-1">
            <Button className="mb-2 -ml-4 h-auto bg-transparent p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 hover:opacity-100" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reports
            </Button>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">{report.website_url}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(report.created_at).toLocaleDateString()}</span>
              <span className="flex items-center gap-1"><Globe className="h-4 w-4" /> {report.industry_tag || "General"}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="gap-2 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:opacity-100"><Share2 className="h-4 w-4" /> Share</Button>
            <Button className="gap-2 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:opacity-100"><Download className="h-4 w-4" /> PDF</Button>
          </div>
        </motion.div>

        {/* Main Score Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="overflow-hidden border-l-4 border-l-orange-500 shadow-lg">
            <div className="flex flex-col gap-8 p-8 md:flex-row md:items-center">
              <div className="flex-1">
                <p className="text-sm font-bold uppercase tracking-wider text-slate-400">TRAP UI Score</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-7xl font-black text-slate-900">{result.score.final}</span>
                  <span className="text-xl text-slate-400">/ 100</span>
                </div>
                {benchmark && (
                  <p className="mt-2 text-sm text-slate-600">
                    {result.score.final >= benchmark.trap_ui_score_avg ? (
                      <span className="font-medium text-green-600">Above Industry Average ({benchmark.trap_ui_score_avg})</span>
                    ) : (
                      <span className="font-medium text-amber-600">Below Industry Average ({benchmark.trap_ui_score_avg})</span>
                    )}
                  </p>
                )}
              </div>
              
              <div className="flex flex-1 justify-around gap-4 border-l border-slate-100 pl-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">{result.cta.count}</p>
                  <p className="text-xs uppercase text-slate-500">CTAs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">{result.density.rating}</p>
                  <p className="text-xs uppercase text-slate-500">Density</p>
                </div>
                <div className="text-center">
                  <div className="flex justify-center -space-x-2">
                    {result.color.palette.slice(0, 3).map((c) => (
                      <div key={c} className="h-8 w-8 rounded-full border-2 border-white ring-1 ring-slate-100" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <p className="mt-1 text-xs uppercase text-slate-500">Palette</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* AI Prediction Section */}
        {result.prediction && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="overflow-hidden bg-slate-900 text-white shadow-xl">
              <div className="border-b border-slate-800 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-orange-400">
                    <CheckCircle className="h-5 w-5" />
                    <h3 className="font-bold uppercase tracking-wide">AI Design Prediction</h3>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200">
                    {result.prediction.modelName} {result.prediction.modelVersion} • {result.prediction.confidence}% confidence
                  </span>
                </div>
              </div>
              <div className="grid gap-8 p-8 md:grid-cols-2">
                <div className="space-y-6">
                  <div>
                    <span className="text-xs uppercase text-slate-500">Recommended Design System</span>
                    <p className="mt-1 text-xl font-medium text-white">{result.prediction.designSystem}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-slate-500">Suggested Layout</span>
                    <p className="mt-1 text-xl font-medium text-white">{result.prediction.suggestedLayout}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-slate-500">Color Psychology</span>
                    <p className="mt-1 text-xl font-medium text-white">{result.prediction.colorPsychology}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-slate-500">Conversion Model</span>
                    <p className="mt-1 text-xl font-medium text-white">{result.prediction.conversionModel}</p>
                  </div>
                </div>
                
                <div className="rounded-xl bg-slate-800 p-6">
                  <span className="text-xs uppercase text-slate-400">Action Items</span>
                  <ul className="mt-4 space-y-4">
                    {result.prediction.actionItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-orange-500" />
                        <span className="text-slate-200">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {(result.prediction.risks || []).length > 0 && (
                <div className="border-t border-slate-800 px-8 py-6">
                  <span className="text-xs uppercase text-slate-500">Risk Flags</span>
                  <ul className="mt-3 space-y-2">
                    {(result.prediction.risks || []).map((risk) => (
                      <li key={risk} className="text-sm text-amber-300">• {risk}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {result.uiBlueprint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">Instant UI Generator</p>
                  <h3 className="text-xl font-bold text-slate-900">Target {result.uiBlueprint.targetScore}/100 Blueprint</h3>
                </div>
                <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                  Projection: {result.uiBlueprint.projectedScoreRange.min}-{result.uiBlueprint.projectedScoreRange.max}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="mb-3 grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-3">
                    <div>
                      <p className="text-[11px] uppercase text-slate-500">Current</p>
                      <p className="text-lg font-bold text-slate-900">{result.uiBlueprint.scoreGapSummary.currentScore}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase text-slate-500">Missing</p>
                      <p className="text-lg font-bold text-amber-600">{result.uiBlueprint.scoreGapSummary.totalGap}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase text-slate-500">Top Issue</p>
                      <p className="text-sm font-bold text-slate-900">{result.uiBlueprint.scoreGapSummary.topIssue}</p>
                    </div>
                  </div>
                  <p className="text-xs uppercase text-slate-400">Strategy</p>
                  <p className="mt-1 text-sm text-slate-700">{result.uiBlueprint.strategySummary}</p>
                  <p className="mt-3 text-xs uppercase text-slate-400">Layout Template</p>
                  <p className="text-sm font-semibold text-slate-900">{result.uiBlueprint.layoutTemplate}</p>
                  <p className="mt-3 text-xs uppercase text-slate-400">CTA Plan</p>
                  <p className="text-sm text-slate-700">
                    {result.uiBlueprint.ctaPlan.primary} / {result.uiBlueprint.ctaPlan.secondary}
                  </p>
                  <p className="text-xs text-slate-500">{result.uiBlueprint.ctaPlan.placement}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs uppercase text-slate-400">Section Plan</p>
                  <div className="space-y-2">
                    {result.uiBlueprint.sections.map((section) => (
                      <div key={section.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <p className="font-semibold text-slate-900">{section.title}</p>
                        <p className="text-xs text-slate-600">{section.targetMetric}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs uppercase text-slate-400">Where Score Is Less</p>
                  <div className="space-y-2">
                    {result.uiBlueprint.metricGaps.map((gap) => (
                      <div key={gap.metricKey} className="rounded-lg border border-slate-200 bg-white p-3">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-slate-900">{gap.label}</p>
                          <span className="text-xs font-semibold text-amber-700">-{gap.scoreLoss}</span>
                        </div>
                        <p className="text-xs text-slate-600">
                          Current {gap.current}/10 • Need +{gap.gap}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">{gap.whyItMatters}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs uppercase text-slate-400">How To Improve</p>
                  <div className="space-y-2">
                    {result.uiBlueprint.improvementRoadmap.map((phase) => (
                      <div key={phase.phase} className="rounded-lg border border-slate-200 bg-white p-3">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-slate-900">{phase.phase}</p>
                          <span className="text-xs font-semibold text-emerald-700">+{phase.expectedScoreGain}</span>
                        </div>
                        <ul className="mt-2 space-y-1">
                          {phase.tasks.map((task) => (
                            <li key={task} className="text-xs text-slate-700">
                              • {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Generated UI Preview (Visual)</p>
                  <button
                    type="button"
                    onClick={openGeneratedPreview}
                    className="inline-flex items-center gap-1 rounded bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-300"
                  >
                    Open Fullscreen <Share2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="p-3">
                  <div className="overflow-hidden rounded-lg border border-slate-200">
                    <iframe
                      title="Generated landing page preview"
                      className="h-[560px] w-full bg-white"
                      sandbox="allow-scripts allow-same-origin"
                      srcDoc={result.uiBlueprint.implementation.htmlPrototype}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Technical Breakdown */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="mb-4 font-bold text-slate-900">Score Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(result.score.breakdown).map(([key, value]) => (
                <div key={key}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="capitalize text-slate-600">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-medium">{value}/10</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-slate-900" style={{ width: `${value * 10}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 font-bold text-slate-900">Screenshot Analysis</h3>
            <div className="relative aspect-video overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
               {/* In a real app, we would serve the screenshot image here */}
               <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                 <p>Screenshot Preview</p>
               </div>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedShell>
  );
}
