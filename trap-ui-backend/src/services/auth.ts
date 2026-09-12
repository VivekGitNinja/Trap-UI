import bcrypt from "bcryptjs";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { UserRole } from "../types.js";
import { pg } from "./db.js";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function assertScanQuota(userId: number): Promise<boolean> {
  const result = await pg().query("SELECT scans_remaining FROM Users WHERE id = $1", [userId]);
  if (result.rowCount === 0) return false;
  return Number(result.rows[0].scans_remaining) > 0;
}

export async function decrementQuota(userId: number): Promise<void> {
  await pg().query(
    "UPDATE Users SET scans_remaining = scans_remaining - 1 WHERE id = $1 AND scans_remaining > 0",
    [userId]
  );
}

export async function resetQuotaForPlan(userId: number, plan: string): Promise<void> {
  const result = await pg().query("SELECT scan_limit FROM Plans WHERE name = $1", [plan]);
  const limit = result.rowCount ? Number(result.rows[0].scan_limit) : Number(process.env.DEFAULT_FREE_SCANS || 5);
  await pg().query("UPDATE Users SET scans_remaining = $1 WHERE id = $2", [limit, userId]);
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    await request.jwtVerify();
  } catch {
    reply.status(401).send({ error: "Unauthorized" });
  }
}

export function requireRole(roles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const role = request.user?.role;
    if (!role || !roles.includes(role)) {
      reply.status(403).send({ error: "Forbidden" });
    }
  };
}
