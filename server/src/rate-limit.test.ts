import { test, expect, describe } from "bun:test";
import { Hono } from "hono";
import { rateLimit, __resetRateLimit } from "./rate-limit";
import { app } from "./app";
import { config } from "./config";

describe("rateLimit middleware", () => {
  test("allows up to max requests then returns 429", async () => {
    __resetRateLimit();
    const a = new Hono();
    a.use("*", rateLimit({ max: 2, windowMs: 60_000 }));
    a.get("/", (c) => c.text("ok"));
    const headers = { "x-forwarded-for": "203.0.113.9" };
    expect((await a.request("/", { headers })).status).toBe(200);
    expect((await a.request("/", { headers })).status).toBe(200);
    const blocked = await a.request("/", { headers });
    expect(blocked.status).toBe(429);
    expect(await blocked.json()).toEqual({ success: false, error: "Rate limit exceeded" });
  });

  test("separate IPs get separate buckets", async () => {
    __resetRateLimit();
    const a = new Hono();
    a.use("*", rateLimit({ max: 1, windowMs: 60_000 }));
    a.get("/", (c) => c.text("ok"));
    expect((await a.request("/", { headers: { "x-forwarded-for": "198.51.100.1" } })).status).toBe(200);
    expect((await a.request("/", { headers: { "x-forwarded-for": "198.51.100.2" } })).status).toBe(200);
  });
});

describe("app wiring", () => {
  // Invalid body → the route returns 422 *after* passing the limiter, so the
  // first RATE_LIMIT_MAX requests must be 422 (allowed through) and request
  // MAX+1 must be 429 (limiter trips before the route runs). Asserting the 422s
  // explicitly proves the limiter actually counts up rather than blocking from
  // the first request — and that it never hits the paid OpenAI call.
  const body = JSON.stringify({});

  test("generate route allows up to max then 429s", async () => {
    __resetRateLimit();
    const headers = { "Content-Type": "application/json", "x-forwarded-for": "198.51.100.7" };
    for (let i = 0; i < config.RATE_LIMIT_MAX; i++) {
      expect((await app.request("/generate-image/openai", { method: "POST", headers, body })).status).toBe(422);
    }
    expect((await app.request("/generate-image/openai", { method: "POST", headers, body })).status).toBe(429);
  });

  test("moderation route allows up to max then 429s", async () => {
    __resetRateLimit();
    const headers = { "Content-Type": "application/json", "x-forwarded-for": "198.51.100.8" };
    for (let i = 0; i < config.RATE_LIMIT_MAX; i++) {
      expect((await app.request("/moderation/moderate", { method: "POST", headers, body })).status).toBe(422);
    }
    expect((await app.request("/moderation/moderate", { method: "POST", headers, body })).status).toBe(429);
  });
});
