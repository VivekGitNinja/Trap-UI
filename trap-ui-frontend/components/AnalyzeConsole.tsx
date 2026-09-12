"use client";

import { useMemo, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Copy,
  CheckCircle,
  ExternalLink,
  Loader2,
  Monitor,
  Search,
  Smartphone,
  Sparkles,
  Target,
  ShieldAlert
} from "lucide-react";
import { getScan, submitScan, directAnalyze } from "@/lib/api";
import { getToken } from "@/lib/session";
import type { AnalysisResult, ScanJob } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const SCAN_STAGES = [
  "Opening website",
  "Capturing screenshots",
  "Parsing UI structure",
  "Detecting CTA and colors",
  "Computing TRAP score",
  "Predicting best design"
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeUrl(input: string): string | null {
  const value = input.trim();
  if (!value) return null;

  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function readErrorMessage(raw: string): string {
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.error && typeof parsed.error === "string") return parsed.error;
  } catch {
    return raw;
  }
  return raw;
}

export function AnalyzeConsole() {
  const [url, setUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [industryTag, setIndustryTag] = useState<"FinTech" | "AI SaaS" | "EdTech">("AI SaaS");
  const [status, setStatus] = useState<"idle" | "submitting" | "queued" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [job, setJob] = useState<ScanJob | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const [codeView, setCodeView] = useState<"react" | "html">("react");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => (job?.result_json as AnalysisResult | undefined) || null, [job]);
  const DIRECT_MODE =
    process.env.NEXT_PUBLIC_DIRECT_ANALYZE === "1" ||
    (typeof window !== "undefined" && window.location.hostname === "localhost");

  async function pollScan(token: string | null, scanJobId: number) {
    let attempts = 0;
    const maxAttempts = 35;

    while (attempts < maxAttempts) {
      const current = await getScan(token, scanJobId);
      setJob(current);

      if (current.status === "completed") {
        setProgress(100);
        setActiveStage(SCAN_STAGES.length - 1);
        return;
      }

      if (current.status === "failed") {
        throw new Error(current.error_message || "Analysis failed");
      }

      attempts += 1;
      const nextProgress = Math.min(92, 18 + attempts * 3.2);
      setProgress(nextProgress);
      setActiveStage(Math.min(SCAN_STAGES.length - 1, Math.floor((nextProgress / 100) * SCAN_STAGES.length)));
      await sleep(900);
    }

    throw new Error("Analysis timed out. Please try again.");
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const normalized = normalizeUrl(url);
    if (!normalized) {
      setError("Enter a valid public URL (example: https://example.com).");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setError("");
    setJob(null);
    setProgress(8);
    setActiveStage(0);
    setPreviewUrl(normalized);

    try {
      if (DIRECT_MODE) {
        const analysis = await directAnalyze({ url: normalized, industryTag });
        setJob({ id: -1, url: normalized, status: "completed", result_json: analysis, error_message: null, created_at: "", updated_at: "" } as unknown as ScanJob);
        setProgress(100);
        setActiveStage(SCAN_STAGES.length - 1);
        setStatus("done");
        return;
      }
      const token = getToken();
      const { scanJobId } = await submitScan(token || null, { url: normalized, industryTag });
      setStatus("queued");
      setProgress(18);
      setActiveStage(1);
      await pollScan(token || null, scanJobId);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setProgress(0);
      setActiveStage(0);
      setError(readErrorMessage((err as Error).message));
    }
  }

  async function copyGeneratedCode() {
    if (!result?.uiBlueprint) return;
    const text =
      codeView === "react"
        ? result.uiBlueprint.implementation.reactComponent
        : result.uiBlueprint.implementation.htmlPrototype;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function openGeneratedPreview() {
    if (!result?.uiBlueprint) return;
    const previewBlob = new Blob([result.uiBlueprint.implementation.htmlPrototype], { type: "text/html" });
    const previewBlobUrl = URL.createObjectURL(previewBlob);
    window.open(previewBlobUrl, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(previewBlobUrl), 60_000);
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-none shadow-xl">
        <div className="bg-slate-900 p-6 text-white">
          <h2 className="text-lg font-semibold">Live URL Analysis</h2>
          <p className="text-slate-400">Paste any public URL to open, scan, analyze, and predict the best design direction.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4 p-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="https://example.com"
                value={url}
                onChange={(event) => {
                  setUrl(event.target.value);
                  const normalized = normalizeUrl(event.target.value);
                  if (normalized) setPreviewUrl(normalized);
                }}
                required
                className="pl-10"
              />
            </div>
            <select
              value={industryTag}
              onChange={(e) => setIndustryTag(e.target.value as "FinTech" | "AI SaaS" | "EdTech")}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm sm:w-44 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="FinTech">FinTech</option>
              <option value="AI SaaS">AI SaaS</option>
              <option value="EdTech">EdTech</option>
            </select>
          </div>

          <Button type="submit" disabled={status === "submitting" || status === "queued"} className="w-full bg-orange-600 hover:bg-orange-700">
            {status === "submitting" || status === "queued" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Open, Scan and Predict <ArrowRight className="h-4 w-4" />
              </span>
            )}
            {status === "submitting" ? "Starting..." : status === "queued" ? "Analyzing..." : ""}
          </Button>
        </form>

        {(status === "queued" || status === "done") && (
          <div className="h-1 w-full bg-slate-100">
            <motion.div
              className="h-full bg-orange-500"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.35 }}
            />
          </div>
        )}
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm font-semibold text-slate-700">Page Preview</p>
            {previewUrl ? (
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700"
              >
                Open in new tab <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </div>
          {previewUrl ? (
            <div className="relative aspect-[16/10] w-full bg-white">
              <iframe
                src={previewUrl}
                title="Website Preview"
                className="h-full w-full border-0"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
              <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-[11px] text-white">
                Some sites may block iframe preview; scan still works.
              </div>
            </div>
          ) : (
            <div className="flex aspect-[16/10] items-center justify-center bg-slate-50 text-sm text-slate-500">
              Paste a URL to open preview here.
            </div>
          )}
        </Card>

        <Card className="p-5">
          <p className="mb-3 text-sm font-semibold text-slate-700">Analysis Pipeline</p>
          <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-slate-900"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.35 }}
            />
          </div>
          <div className="space-y-2">
            {SCAN_STAGES.map((stage, index) => {
              const completed = index < activeStage || status === "done";
              const current = index === activeStage && status !== "done";
              return (
                <div key={stage} className="flex items-center gap-3 rounded-md px-2 py-1">
                  {completed ? (
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  ) : current ? (
                    <Loader2 className="h-4 w-4 animate-spin text-orange-600" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-slate-300" />
                  )}
                  <span className={completed || current ? "text-sm font-medium text-slate-900" : "text-sm text-slate-500"}>{stage}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <AnimatePresence mode="wait">
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </motion.div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Card className="overflow-hidden border-l-4 border-l-green-500 p-0 shadow-lg">
              <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">Analysis Complete</span>
                  </div>
                  <h3 className="mt-1 text-3xl font-bold text-slate-900">Score: {result.score.final}</h3>
                  <p className="text-sm text-slate-500">
                    {result.layout.type} ({result.layout.confidence || 0}% confidence) • {result.cta.count} CTAs
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-right">
                  <div>
                    <p className="text-xs uppercase text-slate-400">Density</p>
                    <p className="font-semibold text-slate-900">{result.density.rating}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-slate-400">Timing</p>
                    <p className="font-semibold text-slate-900">{result.timingMs} ms</p>
                  </div>
                </div>
              </div>

              {result.screenshot.aboveTheFoldUrl ? (
                <div className="border-t border-slate-200 bg-slate-50 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Captured Above The Fold</p>
                  <img
                    src={result.screenshot.aboveTheFoldUrl}
                    alt="Above the fold screenshot"
                    className="w-full rounded-lg border border-slate-200 object-cover"
                    loading="lazy"
                  />
                </div>
              ) : null}
            </Card>

            {result.prediction ? (
              <Card className="p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 text-slate-900">
                    <Sparkles className="h-5 w-5 text-orange-600" />
                    <h4 className="text-lg font-bold">Design Prediction</h4>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {result.prediction.modelName} {result.prediction.modelVersion} • {result.prediction.confidence}% confidence
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs uppercase text-slate-400">Recommended System</p>
                      <p className="font-semibold text-slate-900">{result.prediction.designSystem}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-400">Suggested Layout</p>
                      <p className="font-semibold text-slate-900">{result.prediction.suggestedLayout}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-400">Conversion Model</p>
                      <p className="font-semibold text-slate-900">{result.prediction.conversionModel}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-400">Color Psychology</p>
                      <p className="font-semibold text-slate-900">{result.prediction.colorPsychology}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 text-xs uppercase text-slate-400">Strengths</p>
                      <ul className="space-y-1">
                        {(result.prediction.strengths || []).slice(0, 3).map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-emerald-700">
                            <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-2 text-xs uppercase text-slate-400">Risks</p>
                      <ul className="space-y-1">
                        {(result.prediction.risks || []).slice(0, 3).map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-amber-700">
                            <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs uppercase text-slate-400">Recommended Components</p>
                    <div className="flex flex-wrap gap-2">
                      {(result.prediction.recommendedComponents || []).map((component) => (
                        <span key={component} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          {component}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs uppercase text-slate-400">Priority Actions</p>
                    <ul className="space-y-1">
                      {result.prediction.actionItems.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                          <Target className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ) : null}

            {result.uiBlueprint ? (
              <Card className="p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">Instant UI Generator</p>
                    <h4 className="text-xl font-bold text-slate-900">
                      {result.uiBlueprint.platformName} Target Score Blueprint
                    </h4>
                  </div>
                  <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                    Target: {result.uiBlueprint.targetScore}/100
                    <span className="ml-2 text-emerald-600">
                      ({result.uiBlueprint.projectedScoreRange.min}-{result.uiBlueprint.projectedScoreRange.max} projected)
                    </span>
                  </div>
                </div>

                <div className="mb-5 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase text-slate-500">Current Score</p>
                    <p className="text-2xl font-black text-slate-900">{result.uiBlueprint.scoreGapSummary.currentScore}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-slate-500">Missing Points</p>
                    <p className="text-2xl font-black text-amber-600">{result.uiBlueprint.scoreGapSummary.totalGap}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-slate-500">Biggest Gap</p>
                    <p className="text-lg font-bold text-slate-900">{result.uiBlueprint.scoreGapSummary.topIssue}</p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs uppercase text-slate-400">Strategy Summary</p>
                      <p className="text-sm font-medium text-slate-800">{result.uiBlueprint.strategySummary}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-400">Layout Template</p>
                      <p className="text-sm font-semibold text-slate-900">{result.uiBlueprint.layoutTemplate}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-slate-400">CTA Plan</p>
                      <p className="text-sm text-slate-800">
                        Primary: <span className="font-semibold">{result.uiBlueprint.ctaPlan.primary}</span> • Secondary:{" "}
                        <span className="font-semibold">{result.uiBlueprint.ctaPlan.secondary}</span>
                      </p>
                      <p className="text-xs text-slate-500">{result.uiBlueprint.ctaPlan.placement}</p>
                    </div>
                    <div>
                      <p className="mb-2 text-xs uppercase text-slate-400">Design Tokens</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          ["Primary", result.uiBlueprint.designTokens.primary],
                          ["Secondary", result.uiBlueprint.designTokens.secondary],
                          ["Accent", result.uiBlueprint.designTokens.accent],
                          ["Background", result.uiBlueprint.designTokens.background],
                          ["Text", result.uiBlueprint.designTokens.text]
                        ].map(([label, color]) => (
                          <span
                            key={label}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700"
                          >
                            <span className="h-3 w-3 rounded-full border border-slate-200" style={{ backgroundColor: color }} />
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs uppercase text-slate-400">Generated Page Structure</p>
                    <div className="space-y-2">
                      {result.uiBlueprint.sections.map((section) => (
                        <div key={section.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                          <p className="font-semibold text-slate-900">{section.title}</p>
                          <p className="text-xs text-slate-600">{section.purpose}</p>
                          <p className="mt-1 text-xs font-medium text-slate-500">Metric: {section.targetMetric}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs uppercase text-slate-400">Where Score Is Less (Metric Gaps)</p>
                    <div className="space-y-2">
                      {result.uiBlueprint.metricGaps.map((gap) => (
                        <div key={gap.metricKey} className="rounded-lg border border-slate-200 bg-white p-3">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-slate-900">{gap.label}</p>
                            <span
                              className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                                gap.priority === "high"
                                  ? "bg-red-100 text-red-700"
                                  : gap.priority === "medium"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {gap.priority}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">
                            Current {gap.current}/10 • Gap {gap.gap} • Score loss {gap.scoreLoss}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">{gap.whyItMatters}</p>
                          <ul className="mt-2 space-y-1">
                            {gap.suggestions.slice(0, 2).map((tip) => (
                              <li key={tip} className="text-xs text-slate-700">
                                • {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs uppercase text-slate-400">Improvement Roadmap</p>
                    <div className="space-y-2">
                      {result.uiBlueprint.improvementRoadmap.map((phase) => (
                        <div key={phase.phase} className="rounded-lg border border-slate-200 bg-white p-3">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-slate-900">{phase.phase}</p>
                            <span className="text-xs font-semibold text-emerald-700">+{phase.expectedScoreGain}</span>
                          </div>
                          <p className="text-xs text-slate-600">{phase.goal}</p>
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

                <div className="mt-6 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Generated UI Preview (Visual)</p>
                    <div className="flex items-center gap-2">
                      <div className="flex rounded-lg border border-slate-200 bg-white p-1">
                        <button
                          type="button"
                          onClick={() => setPreviewDevice("desktop")}
                          className={`rounded p-1.5 transition-colors ${
                            previewDevice === "desktop" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600"
                          }`}
                          title="Desktop view"
                        >
                          <Monitor className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewDevice("mobile")}
                          className={`rounded p-1.5 transition-colors ${
                            previewDevice === "mobile" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600"
                          }`}
                          title="Mobile view"
                        >
                          <Smartphone className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="h-4 w-px bg-slate-300" />
                      <button
                        type="button"
                        onClick={openGeneratedPreview}
                        className="inline-flex items-center gap-1 rounded bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
                      >
                        Open Fullscreen <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-slate-100 p-6">
                    <div className="flex justify-center overflow-hidden">
                      <iframe
                        title="Generated landing page preview"
                        className={`bg-white transition-all duration-500 shadow-2xl ${
                          previewDevice === "mobile" 
                            ? "h-[720px] w-[375px] rounded-[32px] border-[8px] border-slate-800 ring-4 ring-slate-200/50" 
                            : "h-[640px] w-full rounded-lg border border-slate-200"
                        }`}
                        sandbox="allow-scripts allow-same-origin"
                        srcDoc={result.uiBlueprint.implementation.htmlPrototype}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-slate-200">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        className={`rounded px-2.5 py-1 text-xs font-semibold ${
                          codeView === "react" ? "bg-slate-900 text-white" : "bg-white text-slate-700"
                        }`}
                        onClick={() => setCodeView("react")}
                        type="button"
                      >
                        React (Next.js)
                      </button>
                      <button
                        className={`rounded px-2.5 py-1 text-xs font-semibold ${
                          codeView === "html" ? "bg-slate-900 text-white" : "bg-white text-slate-700"
                        }`}
                        onClick={() => setCodeView("html")}
                        type="button"
                      >
                        HTML
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={copyGeneratedCode}
                      className="inline-flex items-center gap-1 rounded bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-300"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {copied ? "Copied" : "Copy code"}
                    </button>
                  </div>
                  <pre className="max-h-[380px] overflow-auto bg-slate-950 p-4 text-xs text-slate-100">
                    {codeView === "react"
                      ? result.uiBlueprint.implementation.reactComponent
                      : result.uiBlueprint.implementation.htmlPrototype}
                  </pre>
                </div>
              </Card>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
