import type { FastifyInstance } from "fastify";
import { getBenchmarks, getReport, listAllReports, listReports } from "../controllers/reportController.js";

export async function reportRoutes(app: FastifyInstance): Promise<void> {
  app.get("/reports", listReports);
  app.get("/reports/:id", getReport);
  app.get("/admin/reports", listAllReports);
  app.get("/benchmarks", getBenchmarks);
}
