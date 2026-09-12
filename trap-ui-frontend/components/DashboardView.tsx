"use client";

import { useEffect, useMemo, useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, BarChart, XAxis, YAxis, Bar } from "recharts";
import { motion } from "framer-motion";
import { getBenchmarks, getReport, getReports } from "@/lib/api";
import { getToken } from "@/lib/session";
import type { AnalysisResult, Benchmark } from "@/types";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function DashboardView() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [benchmark, setBenchmark] = useState<Benchmark | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const token = getToken();
        const reports = await getReports(token || null);
        if (!reports.length) return;

        const detailed = await getReport(token || null, reports[0].id);
        setResult(detailed.breakdown_json);
        setBenchmark(detailed.benchmark);

        if (!detailed.benchmark) {
          const list = await getBenchmarks(token || null);
          setBenchmark(list[0] || null);
        }
      } catch (err) {
        setError((err as Error).message);
      }
    })();
  }, []);

  const scoreData = useMemo(() => {
    if (!result) return [];
    return [
      { metric: "Color", value: result.score.breakdown.colorTrustIndex },
      { metric: "Layout", value: result.score.breakdown.layoutEfficiency },
      { metric: "CTA", value: result.score.breakdown.ctaOptimization },
      { metric: "Conversion", value: result.score.breakdown.conversionIndicators },
      { metric: "Mobile", value: result.score.breakdown.mobileResponsiveness }
    ];
  }, [result]);

  if (error) {
    return (
      <Card className="flex items-center gap-2 border-red-200 bg-red-50 p-4 text-red-700">
        <AlertCircle className="h-5 w-5" />
        <p>{error}</p>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="p-8 text-center text-slate-500">
        <p>Run a scan to populate dashboard insights.</p>
      </Card>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4 md:grid-cols-2"
    >
      <motion.div variants={item}>
        <Card className="p-6">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">TRAP UI Score</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-5xl font-bold text-slate-900">{result.score.final}</p>
            <span className="text-sm text-slate-400">/ 100</span>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Layout: <span className="font-medium text-slate-900">{result.layout.type}</span>
          </p>
          <p className="text-sm text-slate-600">
            Density: <span className="font-medium text-slate-900">{result.density.rating}</span>
          </p>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="p-6">
          <p className="mb-4 text-sm font-medium text-slate-500 uppercase tracking-wide">Color Palette</p>
          <div className="flex flex-wrap gap-3">
            {result.color.palette.map((c, i) => (
              <motion.div 
                key={c}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex flex-col items-center gap-1"
              >
                <div 
                  className="h-12 w-12 rounded-lg border border-slate-200 shadow-sm transition-transform group-hover:scale-110" 
                  style={{ backgroundColor: c }} 
                />
                <span className="text-[10px] font-mono text-slate-500">{c}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item} className="md:col-span-1">
        <Card className="h-80 p-6">
          <p className="mb-4 text-sm font-medium text-slate-500 uppercase tracking-wide">Score Breakdown</p>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={scoreData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 12 }} />
              <Radar 
                name="Score" 
                dataKey="value" 
                stroke="#f97316" 
                fill="#f97316" 
                fillOpacity={0.2} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      <motion.div variants={item} className="md:col-span-1">
        <Card className="h-80 p-6">
          <p className="mb-4 text-sm font-medium text-slate-500 uppercase tracking-wide">Metric Analysis</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="metric" tick={{ fontSize: 10 }} interval={0} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" fill="#0f172a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      <motion.div variants={item} className="md:col-span-2">
        <Card className="p-6">
          <p className="mb-4 text-sm font-medium text-slate-500 uppercase tracking-wide">CTA Analysis</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-2xl font-bold text-slate-900">{result.cta.count}</p>
              <p className="text-xs text-slate-500">Total Buttons</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="truncate text-lg font-medium text-slate-900" title={result.cta.primary || "N/A"}>
                {result.cta.primary || "N/A"}
              </p>
              <p className="text-xs text-slate-500">Primary CTA</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-2xl font-bold text-slate-900">{result.cta.placementScore}<span className="text-sm font-normal text-slate-400">/10</span></p>
              <p className="text-xs text-slate-500">Placement Score</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
