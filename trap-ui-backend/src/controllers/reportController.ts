import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { getIndustryBenchmark, listBenchmarks } from "../services/benchmarks.js";
import { pg } from "../services/db.js";

export async function listReports(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const result = await pg().query(
    `SELECT id, website_url, trap_ui_score, industry_tag, created_at
     FROM Reports
     ORDER BY created_at DESC
     LIMIT 100`,
  );
  reply.send(result.rows);
}

export async function getReport(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const params = z.object({ id: z.coerce.number().int().positive() }).safeParse(request.params);
  if (!params.success) {
    reply.status(400).send({ error: "Invalid report id" });
    return;
  }

  const result = await pg().query(
    "SELECT id, user_id, website_url, trap_ui_score, breakdown_json, industry_tag, created_at FROM Reports WHERE id=$1",
    [params.data.id]
  );

  if (!result.rowCount) {
    reply.status(404).send({ error: "Report not found" });
    return;
  }

  const report = result.rows[0];
  const benchmark = report.industry_tag ? await getIndustryBenchmark(report.industry_tag) : null;

  reply.send({
    ...report,
    benchmark
  });
}

export async function listAllReports(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const result = await pg().query(
    `SELECT id, user_id, website_url, trap_ui_score, industry_tag, created_at
     FROM Reports
     ORDER BY created_at DESC
     LIMIT 200`
  );
  reply.send(result.rows);
}

export async function getBenchmarks(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
  if (process.env.NO_INFRA === "1") {
    reply.send([]);
    return;
  }
  const rows = await listBenchmarks();
  reply.send(rows);
}
