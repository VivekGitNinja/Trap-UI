import { MongoClient } from "mongodb";
import { Pool } from "pg";

const postgres = new Pool({ connectionString: process.env.POSTGRES_URL });
const mongoClient = new MongoClient(process.env.MONGODB_URL || "mongodb://localhost:27017");

const planRows = [
  { name: "free", scan_limit: Number(process.env.DEFAULT_FREE_SCANS || 5) },
  { name: "pro", scan_limit: 200 },
  { name: "enterprise", scan_limit: 5000 }
];

const industryRows = [
  {
    industry_name: "FinTech",
    year: 2026,
    avg_cta_count: 5,
    dominant_layout: "Dashboard Layout",
    dominant_colors: ["#0a2540", "#2d6cdf", "#ffffff"],
    ui_density_avg: 5.6,
    trap_ui_score_avg: 74
  },
  {
    industry_name: "AI SaaS",
    year: 2026,
    avg_cta_count: 4,
    dominant_layout: "Split Hero",
    dominant_colors: ["#111827", "#14b8a6", "#f8fafc"],
    ui_density_avg: 4.8,
    trap_ui_score_avg: 78
  },
  {
    industry_name: "EdTech",
    year: 2026,
    avg_cta_count: 6,
    dominant_layout: "Centered Hero",
    dominant_colors: ["#1d4ed8", "#f59e0b", "#ffffff"],
    ui_density_avg: 6.2,
    trap_ui_score_avg: 72
  }
];

export async function initDatabases(): Promise<void> {
  await postgres.query(`
    CREATE TABLE IF NOT EXISTS Plans (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      scan_limit INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS Users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      plan TEXT NOT NULL DEFAULT 'free',
      scans_remaining INTEGER NOT NULL DEFAULT 5,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS Reports (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES Users(id),
      website_url TEXT NOT NULL,
      trap_ui_score NUMERIC NOT NULL,
      breakdown_json JSONB NOT NULL,
      industry_tag TEXT,
      pdf_path TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS ScanJobs (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES Users(id),
      url TEXT NOT NULL,
      status TEXT NOT NULL,
      result_json JSONB,
      error_message TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // Ensure user_id is nullable for anonymous scans
  await postgres.query(`
    ALTER TABLE Reports ALTER COLUMN user_id DROP NOT NULL;
    ALTER TABLE ScanJobs ALTER COLUMN user_id DROP NOT NULL;
  `).catch(() => {
    // Ignore errors if columns are already nullable or tables don't exist yet (though they should)
  });

  for (const plan of planRows) {
    await postgres.query(
      `INSERT INTO Plans(name, scan_limit)
       VALUES ($1, $2)
       ON CONFLICT(name) DO UPDATE SET scan_limit = EXCLUDED.scan_limit`,
      [plan.name, plan.scan_limit]
    );
  }

  await mongoClient.connect();
  const db = mongoClient.db(process.env.MONGODB_DB || "trap_ui");

  await db.createCollection("IndustryData").catch(() => undefined);
  await db.createCollection("WebsiteAnalysis").catch(() => undefined);

  await db.collection("IndustryData").createIndex({ industry_name: 1, year: -1 });
  await db.collection("WebsiteAnalysis").createIndex({ url: 1, created_at: -1 });

  for (const row of industryRows) {
    await db.collection("IndustryData").updateOne(
      { industry_name: row.industry_name, year: row.year },
      { $set: row },
      { upsert: true }
    );
  }
}

import { mockReportList, mockReportDetails, addMockReport } from "./mockData.js";

export const pg = () => {
  if (process.env.NO_INFRA === "1") {
    return {
      query: async (text: string, params: any[]) => {
        if (text.includes("INSERT INTO Reports")) {
          // params order: [user_id, scan_job_id, url, title, overall_score, breakdown_json]
          // The query is from scanController.ts `directAnalyze`
          const url = params[2];
          const score = params[4];
          const breakdown = typeof params[5] === "string" ? JSON.parse(params[5]) : params[5];
          const industry = breakdown?.prediction?.industryTag || "Unknown";

          addMockReport(url, score, breakdown, industry);
          return { rowCount: 1, rows: [] };
        }
        if (text.includes("FROM Reports") && text.includes("ORDER BY created_at DESC")) {
          return { rowCount: mockReportList.length, rows: mockReportList };
        }
        if (text.includes("FROM Reports WHERE id=$1")) {
          const report = mockReportDetails.find((r: any) => r.id === params[0]);
          return { rowCount: report ? 1 : 0, rows: report ? [report] : [] };
        }
        return { rowCount: 0, rows: [] };
      }
    } as any;
  }
  return postgres;
};
export const mongodb = () => {
  if (process.env.NO_INFRA === "1") {
    return {
      collection: () => ({
        findOne: async () => null,
        find: () => ({ toArray: async () => [] }),
        insertOne: async () => { },
        updateOne: async () => { },
        createIndex: async () => { }
      })
    } as any;
  }
  return mongoClient.db(process.env.MONGODB_DB || "trap_ui");
};
