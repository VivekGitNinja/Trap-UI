import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { scanQueue } from "../queue/scanQueue.js";
import { getIndustryBenchmark } from "../services/benchmarks.js";
import { pg } from "../services/db.js";
import type { UiMotionLevel, UiStylePreset } from "../types.js";
import { robotsAllowsScan } from "../utils/robots.js";
import { isPublicUrl, looksLikeLoginPage } from "../utils/url.js";
import { runAnalysis } from "../services/analyticsClient.js";
import { generatePrediction } from "../services/predictionService.js";
import { generateUiBlueprint } from "../services/uiGeneratorService.js";

const scanSchema = z.object({
  url: z.string().url().max(2048),
  industryTag: z.enum(["FinTech", "AI SaaS", "EdTech"]).optional(),
  stylePreset: z.enum(["conversion-max", "glass-lux", "neo-bold"]).optional(),
  motionLevel: z.enum(["minimal", "balanced", "cinematic"]).optional()
});

export async function submitScan(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const parsed = scanSchema.safeParse(request.body);
  if (!parsed.success) {
    reply.status(400).send({ error: "Invalid URL payload" });
    return;
  }

  const { url, industryTag, stylePreset, motionLevel } = parsed.data;

  if (!(await isPublicUrl(url))) {
    reply.status(400).send({ error: "Only public HTTP/HTTPS URLs are allowed" });
    return;
  }

  if (looksLikeLoginPage(url)) {
    reply.status(400).send({ error: "Login/auth pages are not supported" });
    return;
  }

  const robotsAllowed = await robotsAllowsScan(url);
  if (!robotsAllowed) {
    reply.status(403).send({ error: "robots.txt disallows scanning this URL" });
    return;
  }

  let benchmark = null;
  if (industryTag) {
    benchmark = await getIndustryBenchmark(industryTag);
    // In NO_INFRA mode, benchmark might be null if DB is mocked to return null.
    // We should allow it to proceed if we are skipping infra, or enforce it if we require DB data.
    // For now, if we are in NO_INFRA mode, we can proceed without benchmark data or use a fallback.
    if (!benchmark && process.env.NO_INFRA !== "1") {
      reply.status(400).send({ error: "Unsupported industry tag" });
      return;
    }
  }

  const inserted = await pg().query(
    "INSERT INTO ScanJobs (user_id, url, status) VALUES ($1, $2, 'queued') RETURNING id",
    [null, url]
  );

  const scanJobId = Number(inserted.rows[0].id);
  await scanQueue.add("scan", {
    scanJobId,
    url,
    userId: null,
    industryTag: industryTag || null,
    stylePreset: (stylePreset || null) as UiStylePreset | null,
    motionLevel: (motionLevel || null) as UiMotionLevel | null
  });

  reply.status(202).send({ scanJobId, status: "queued" });
}

export async function getScanStatus(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const params = z.object({ id: z.coerce.number().int().positive() }).safeParse(request.params);
  if (!params.success) {
    reply.status(400).send({ error: "Invalid scan id" });
    return;
  }

  const result = await pg().query(
    `SELECT id, url, status, result_json, error_message, created_at, updated_at
     FROM ScanJobs
     WHERE id = $1`,
    [params.data.id]
  );

  if (!result.rowCount) {
    reply.status(404).send({ error: "Scan job not found" });
    return;
  }

  reply.send(result.rows[0]);
}

export async function directAnalyze(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const parsed = scanSchema.safeParse(request.body);
  if (!parsed.success) {
    reply.status(400).send({ error: "Invalid URL payload" });
    return;
  }

  const { url, industryTag, stylePreset, motionLevel } = parsed.data;

  if (!(await isPublicUrl(url))) {
    reply.status(400).send({ error: "Only public HTTP/HTTPS URLs are allowed" });
    return;
  }

  if (looksLikeLoginPage(url)) {
    reply.status(400).send({ error: "Login/auth pages are not supported" });
    return;
  }

  if (industryTag) {
    const benchmark = await getIndustryBenchmark(industryTag);
    if (!benchmark && process.env.NO_INFRA !== "1") {
      reply.status(400).send({ error: "Unsupported industry tag" });
      return;
    }
  }

  const rawResult = await runAnalysis(url, industryTag || null);
  const prediction = generatePrediction(rawResult, industryTag || null);
  const normalizedIndustry =
    industryTag === "FinTech" || industryTag === "AI SaaS" || industryTag === "EdTech" ? industryTag : null;
  const uiBlueprint = generateUiBlueprint(rawResult, prediction, url, normalizedIndustry, {
    stylePreset: (stylePreset || null) as UiStylePreset | null,
    motionLevel: (motionLevel || null) as UiMotionLevel | null
  });

  const result = {
    ...rawResult,
    prediction,
    uiBlueprint
  };

  // Save to database so dashboard and reports can see it
  try {
    const title = url.replace(/^https?:\/\//i, "").split("/")[0] || url;
    await pg().query(
      `INSERT INTO Reports (user_id, scan_job_id, url, title, overall_score, breakdown_json)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [null, null, url, title, result.score.final, JSON.stringify(result)]
    );
  } catch (err) {
    console.error("Failed to save direct-analyze report", err);
  }

  reply.send(result);
}
