import Fastify from "fastify";
import cors from "@fastify/cors";
import { registerRateLimit } from "./middlewares/rateLimit.js";
import { reportRoutes } from "./routes/reportRoutes.js";
import { scanRoutes } from "./routes/scanRoutes.js";

export async function buildApp() {
  const app = Fastify({ logger: true, trustProxy: true });

  await app.register(cors, { origin: true });
  await registerRateLimit(app);

  await app.register(scanRoutes, { prefix: "/api" });
  await app.register(reportRoutes, { prefix: "/api" });

  app.get("/health", async () => ({ ok: true }));

  return app;
}
