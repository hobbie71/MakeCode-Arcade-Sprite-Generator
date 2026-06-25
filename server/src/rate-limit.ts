import type { Context, Next } from "hono";

type Bucket = { count: number; windowStart: number };
const buckets = new Map<string, Bucket>();

/** Test-only: clear all buckets between tests. */
export function __resetRateLimit(): void {
  buckets.clear();
}

function clientIp(c: Context): string {
  const xff = c.req.header("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return c.req.header("x-real-ip") ?? "unknown";
}

export function rateLimit(opts: { max: number; windowMs: number }) {
  return async (c: Context, next: Next) => {
    const ip = clientIp(c);
    const now = Date.now();
    const bucket = buckets.get(ip);
    if (!bucket || now - bucket.windowStart >= opts.windowMs) {
      buckets.set(ip, { count: 1, windowStart: now });
      return next();
    }
    if (bucket.count >= opts.max) {
      return c.json({ success: false, error: "Rate limit exceeded" }, 429);
    }
    bucket.count += 1;
    return next();
  };
}
