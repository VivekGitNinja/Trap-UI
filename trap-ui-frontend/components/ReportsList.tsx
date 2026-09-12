"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, ArrowRight } from "lucide-react";
import { getReports } from "@/lib/api";
import { getToken } from "@/lib/session";
import type { ReportSummary } from "@/types";
import { Card } from "@/components/ui/card";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

export function ReportsList() {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = getToken();
        const items = await getReports(token || null);
        setReports(items);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 w-full animate-pulse rounded-lg bg-slate-100" />
        ))}
      </div>
    );
  }

  if (error) return <Card className="border-red-200 bg-red-50 p-4 text-red-700">{error}</Card>;

  if (!reports.length) return <Card className="p-8 text-center text-slate-500">No reports found yet.</Card>;

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      {reports.map((report) => (
        <motion.div key={report.id} variants={item}>
          <Link href={`/reports/${report.id}`}>
            <Card className="group flex items-center justify-between p-4 transition-colors hover:bg-slate-50">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-orange-100 p-2 text-orange-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{report.website_url}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="font-medium text-slate-900">Score: {report.trap_ui_score}</span>
                    <span>•</span>
                    <span>{report.industry_tag || "General"}</span>
                    <span>•</span>
                    <span className="text-xs text-slate-400">{new Date(report.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-slate-500" />
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
