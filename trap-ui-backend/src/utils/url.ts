import { promises as dns } from "node:dns";
import net from "node:net";

const PRIVATE_IP_PATTERNS = [
  /^10\./,
  /^127\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^192\.168\./,
  /^::1$/,
  /^fc00:/i,
  /^fd00:/i,
  /^fe80:/i
];

const LOGIN_HINTS = ["login", "signin", "sign-in", "auth", "account", "session"];

function isPrivateIp(address: string): boolean {
  return PRIVATE_IP_PATTERNS.some((re) => re.test(address));
}

export async function isPublicUrl(raw: string): Promise<boolean> {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return false;
  }

  if (!["http:", "https:"].includes(parsed.protocol)) return false;
  if (parsed.username || parsed.password) return false;

  const host = parsed.hostname.toLowerCase();
  if (["localhost", "0.0.0.0", "::1"].includes(host)) return false;

  if (net.isIP(host) && isPrivateIp(host)) return false;

  try {
    const resolved = await dns.lookup(host);
    if (isPrivateIp(resolved.address)) return false;
  } catch {
    return false;
  }

  return true;
}

export function looksLikeLoginPage(raw: string): boolean {
  try {
    const parsed = new URL(raw);
    const text = `${parsed.pathname}${parsed.search}`.toLowerCase();
    return LOGIN_HINTS.some((hint) => text.includes(hint));
  } catch {
    return true;
  }
}
