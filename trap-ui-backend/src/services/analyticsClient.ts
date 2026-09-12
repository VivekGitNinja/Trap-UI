import type { AnalyticsResult } from "../types.js";

export async function runAnalysis(url: string, industry?: string | null): Promise<AnalyticsResult> {
  const base = process.env.ANALYTICS_SERVICE_URL || "http://localhost:8000";
  const response = await fetch(`${base}/analyze`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url, industry })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Analytics service failed: ${text}`);
  }

  return (await response.json()) as AnalyticsResult;
}
