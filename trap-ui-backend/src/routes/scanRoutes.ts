import type { FastifyInstance } from "fastify";
import { getScanStatus, submitScan, directAnalyze } from "../controllers/scanController.js";

export async function scanRoutes(app: FastifyInstance): Promise<void> {
  app.post("/scan", submitScan);
  app.get("/scan/:id", getScanStatus);
  app.post("/direct-analyze", directAnalyze);
}
