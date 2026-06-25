import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  ModerationRequestSchema,
  OpenAISpriteRequestSchema,
} from "@makespritecode/shared";
import { config } from "./config";
import { generateOpenAISprite, moderatePrompt } from "./openai";
import { applyModerationOverride } from "./moderation-logic";
import { rateLimit } from "./rate-limit";

export const app = new Hono();

// CORS — mirrors the FastAPI CORSMiddleware (allow-list from CORS_ORIGINS,
// credentials, the methods/headers this API actually uses).
app.use(
  "*",
  cors({
    origin: config.CORS_ORIGINS,
    credentials: true,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

// Request logging (parity with LogRequestMiddleware).
app.use("*", async (c, next) => {
  console.log(`Request: ${c.req.method} ${c.req.url} Origin: ${c.req.header("origin") ?? "None"}`);
  await next();
});

// Per-IP rate limit on the paid endpoints (in-memory fixed window).
const limiter = rateLimit({ max: config.RATE_LIMIT_MAX, windowMs: config.RATE_LIMIT_WINDOW_MS });
app.use("/generate-image/*", limiter);
app.use("/moderation/*", limiter);

app.get("/", (c) =>
  c.json({ message: "MakeCode Arcade Sprite Generator API", version: "0.1.0" }),
);

app.post("/generate-image/openai", async (c) => {
  const parsed = OpenAISpriteRequestSchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) {
    return c.json({ success: false, error: "Invalid request", detail: parsed.error.issues }, 422);
  }
  const { settings, size, palette } = parsed.data;
  const result = await generateOpenAISprite(settings, size, palette);
  return c.json(result);
});

app.post("/moderation/moderate", async (c) => {
  const parsed = ModerationRequestSchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) {
    return c.json({ success: false, error: "Invalid request", detail: parsed.error.issues }, 422);
  }
  const moderation = await moderatePrompt(parsed.data.prompt);
  const result = moderation.results[0];
  if (!result) throw new Error("OpenAI moderation returned no result");
  return c.json(
    applyModerationOverride({
      flagged: result.flagged,
      categories: result.categories as unknown as Record<string, boolean>,
      category_scores: result.category_scores as unknown as Record<string, number>,
    }),
  );
});

// Error envelopes (parity with the FastAPI 404 / 500 handlers).
app.notFound((c) => c.json({ success: false, error: "Endpoint not found" }, 404));
app.onError((err, c) => {
  console.error(`Internal server error: ${err}`);
  return c.json({ success: false, error: "Internal server error" }, 500);
});
