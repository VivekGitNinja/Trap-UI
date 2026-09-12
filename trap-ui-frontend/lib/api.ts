import type { AnalysisResult, Benchmark, ReportSummary, ScanJob, UserProfile } from "@/types";

const IS_SERVER = typeof window === "undefined";
const BACKEND_URL = IS_SERVER
  ? process.env.INTERNAL_BACKEND_URL || "http://backend:4000"
  : process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json() as Promise<T>;
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
  plan: "free" | "pro" | "enterprise";
}): Promise<{ token: string; user: UserProfile }> {
  return request("/api/auth/register", { method: "POST", body: JSON.stringify(data) });
}

export async function login(data: { email: string; password: string }): Promise<{ token: string; user: UserProfile }> {
  return request("/api/auth/login", { method: "POST", body: JSON.stringify(data) });
}

export async function me(token: string): Promise<UserProfile> {
  return request("/api/auth/me", {}, token);
}

export async function submitScan(
  token: string | null,
  data: { url: string; industryTag?: "FinTech" | "AI SaaS" | "EdTech" }
): Promise<{ scanJobId: number; status: string }> {
  return request("/api/scan", { method: "POST", body: JSON.stringify(data) }, token || undefined);
}

export async function getScan(token: string | null, scanJobId: number): Promise<ScanJob> {
  return request(`/api/scan/${scanJobId}`, {}, token || undefined);
}

export async function getReports(token: string | null): Promise<ReportSummary[]> {
  return request("/api/reports", {}, token || undefined);
}

export async function getReport(token: string | null, reportId: number): Promise<{ breakdown_json: AnalysisResult; benchmark: Benchmark | null }> {
  return request(`/api/reports/${reportId}`, {}, token || undefined);
}

export async function getBenchmarks(token: string | null): Promise<Benchmark[]> {
  return request("/api/benchmarks", {}, token || undefined);
}

export async function directAnalyze(
  data: { url: string; industryTag?: "FinTech" | "AI SaaS" | "EdTech" }
): Promise<AnalysisResult> {
  return request("/api/direct-analyze", { method: "POST", body: JSON.stringify(data) });
}
