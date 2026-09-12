import type { FastifyInstance } from "fastify";

export async function registerRateLimit(app: FastifyInstance): Promise<void> {
  await app.register(import("@fastify/rate-limit"), {
    max: 30,
    timeWindow: "1 minute",
    hook: "preHandler",
    errorResponseBuilder: () => ({ error: "Too many requests" })
  });
}
