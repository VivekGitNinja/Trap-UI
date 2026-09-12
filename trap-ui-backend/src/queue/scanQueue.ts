import { Queue, Worker } from "bullmq";
import { runAnalysis } from "../services/analyticsClient.js";
import { mongodb, pg } from "../services/db.js";
import { generatePrediction } from "../services/predictionService.js";
import { generateUiBlueprint } from "../services/uiGeneratorService.js";
import type { UiMotionLevel, UiStylePreset } from "../types.js";

const redisUrl = new URL(process.env.REDIS_URL || "redis://localhost:6379");
const redisConnection = {
  host: redisUrl.hostname,
  port: Number(redisUrl.port || "6379"),
  username: redisUrl.username || undefined,
  password: redisUrl.password || undefined,
  maxRetriesPerRequest: null as null
};

export const scanQueue = new Queue("scan-jobs", { connection: redisConnection });

export function startScanWorker(): void {
  new Worker(
    "scan-jobs",
    async (job) => {
      const { scanJobId, url, userId, industryTag, stylePreset, motionLevel } = job.data as {
        scanJobId: number;
        url: string;
        userId: number | null;
        industryTag: string | null;
        stylePreset: UiStylePreset | null;
        motionLevel: UiMotionLevel | null;
      };

      await pg().query("UPDATE ScanJobs SET status='processing', updated_at=NOW() WHERE id=$1", [scanJobId]);

      try {
        const rawResult = await runAnalysis(url, industryTag);
        
        // Enrich result with design predictions and instant UI generation.
        const prediction = generatePrediction(rawResult, industryTag);
        const normalizedIndustry =
          industryTag === "FinTech" || industryTag === "AI SaaS" || industryTag === "EdTech" ? industryTag : null;
        const uiBlueprint = generateUiBlueprint(rawResult, prediction, url, normalizedIndustry, {
          stylePreset,
          motionLevel
        });
        const result = {
          ...rawResult,
          prediction,
          uiBlueprint
        };

        await pg().query(
          `UPDATE ScanJobs
           SET status='completed', result_json=$1::jsonb, updated_at=NOW()
           WHERE id=$2`,
          [JSON.stringify(result), scanJobId]
        );

        await pg().query(
          `INSERT INTO Reports (user_id, website_url, trap_ui_score, breakdown_json, industry_tag)
           VALUES ($1, $2, $3, $4::jsonb, $5)`,
          [userId, url, result.score.final, JSON.stringify(result), industryTag]
        );

        await mongodb().collection("WebsiteAnalysis").insertOne({
          url,
          layout_type: result.layout.type,
          cta_count: result.cta.count,
          primary_color: result.color.primaryColor,
          density_score: result.density.score,
          trap_ui_score: result.score.final,
          breakdown: result.score.breakdown,
          prediction,
          ui_blueprint: uiBlueprint,
          industry_tag: industryTag,
          created_at: new Date()
        });
      } catch (error) {
        await pg().query(
          `UPDATE ScanJobs
           SET status='failed', error_message=$1, updated_at=NOW()
           WHERE id=$2`,
          [(error as Error).message, scanJobId]
        );
      }
    },
    { connection: redisConnection, concurrency: 5 }
  );
}
