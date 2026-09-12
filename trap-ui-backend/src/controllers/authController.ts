import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { hashPassword, verifyPassword } from "../services/auth.js";
import { pg } from "../services/db.js";

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  password: z.string().min(8).max(128),
  plan: z.enum(["free", "pro", "enterprise"]).default("free")
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128)
});

export async function register(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const parsed = registerSchema.safeParse(request.body);
  if (!parsed.success) {
    reply.status(400).send({ error: "Invalid register payload" });
    return;
  }

  const { name, email, password, plan } = parsed.data;
  const planResult = await pg().query("SELECT scan_limit FROM Plans WHERE name=$1", [plan]);
  const scans = planResult.rowCount ? Number(planResult.rows[0].scan_limit) : Number(process.env.DEFAULT_FREE_SCANS || 5);
  const passwordHash = await hashPassword(password);

  try {
    const result = await pg().query(
      `INSERT INTO Users(name, email, password_hash, role, plan, scans_remaining)
       VALUES ($1, $2, $3, 'user', $4, $5)
       RETURNING id, name, email, role, plan, scans_remaining`,
      [name.trim(), email.toLowerCase(), passwordHash, plan, scans]
    );

    const user = result.rows[0];
    const token = request.server.jwt.sign({ id: user.id, email: user.email, role: user.role });
    reply.status(201).send({ token, user });
  } catch {
    reply.status(409).send({ error: "Email already exists" });
  }
}

export async function login(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const parsed = loginSchema.safeParse(request.body);
  if (!parsed.success) {
    reply.status(400).send({ error: "Invalid login payload" });
    return;
  }

  const { email, password } = parsed.data;
  const result = await pg().query(
    "SELECT id, name, email, password_hash, role, plan, scans_remaining FROM Users WHERE email=$1",
    [email.toLowerCase()]
  );

  if (!result.rowCount) {
    reply.status(401).send({ error: "Invalid credentials" });
    return;
  }

  const user = result.rows[0];
  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    reply.status(401).send({ error: "Invalid credentials" });
    return;
  }

  const token = request.server.jwt.sign({ id: user.id, email: user.email, role: user.role });
  reply.send({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan,
      scans_remaining: user.scans_remaining
    }
  });
}

export async function me(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const userId = Number(request.user.id);
  const result = await pg().query(
    "SELECT id, name, email, role, plan, scans_remaining, created_at FROM Users WHERE id=$1",
    [userId]
  );

  if (!result.rowCount) {
    reply.status(404).send({ error: "User not found" });
    return;
  }

  reply.send(result.rows[0]);
}
