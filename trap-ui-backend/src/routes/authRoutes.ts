import type { FastifyInstance } from "fastify";
import { login, me, register } from "../controllers/authController.js";
import { requireAuth } from "../services/auth.js";

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post("/auth/register", register);
  app.post("/auth/login", login);
  app.get("/auth/me", { preHandler: [requireAuth] }, me);
}
