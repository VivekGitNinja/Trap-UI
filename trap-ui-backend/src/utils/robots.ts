function parseRobots(content: string, targetPath: string): boolean {
  const lines = content.split(/\r?\n/).map((line) => line.trim());

  let active = false;
  const disallows: string[] = [];

  for (const line of lines) {
    if (!line || line.startsWith("#")) continue;
    const [keyRaw, valueRaw] = line.split(":", 2);
    if (!keyRaw || !valueRaw) continue;

    const key = keyRaw.trim().toLowerCase();
    const value = valueRaw.trim();

    if (key === "user-agent") {
      active = value === "*";
      continue;
    }

    if (active && key === "disallow") {
      disallows.push(value);
    }
  }

  for (const pattern of disallows) {
    if (!pattern) continue;
    if (pattern === "/") return false;
    if (targetPath.startsWith(pattern)) return false;
  }

  return true;
}

export async function robotsAllowsScan(rawUrl: string): Promise<boolean> {
  try {
    const target = new URL(rawUrl);
    const robotsUrl = `${target.protocol}//${target.host}/robots.txt`;
    const response = await fetch(robotsUrl, { method: "GET" });
    if (!response.ok) return true;

    const content = await response.text();
    return parseRobots(content, target.pathname || "/");
  } catch {
    return true;
  }
}
