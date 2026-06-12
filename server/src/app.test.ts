import { test, expect, describe } from "bun:test";
import { app } from "./app";

// These exercise routing + validation only; they never reach the OpenAI API
// (validation rejects before the upstream call), so no billable calls are made.

describe("routing", () => {
  test("GET / returns the health payload", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      message: "MakeCode Arcade Sprite Generator API",
      version: "0.1.0",
    });
  });

  test("unknown route returns the 404 envelope", async () => {
    const res = await app.request("/does-not-exist");
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ success: false, error: "Endpoint not found" });
  });
});

describe("request validation (422 before any upstream call)", () => {
  test("openai: missing settings.assetType", async () => {
    const res = await app.request("/generate-image/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: { prompt: "x" }, size: { width: 16, height: 16 }, palette: {} }),
    });
    expect(res.status).toBe(422);
  });

  test("moderation: missing prompt", async () => {
    const res = await app.request("/moderation/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(422);
  });
});
