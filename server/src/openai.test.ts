import { test, expect, describe, mock, beforeEach } from "bun:test";
import type {
  MakeCodePalette,
  OpenAIGenerationSettings,
} from "@makespritecode/shared";
import { AssetType, Style, OpenAIQuality } from "@makespritecode/shared";

// ---------------------------------------------------------------------------
// Stub the OpenAI SDK so importing/exercising ./openai needs no API key and
// makes no network call. We capture the params each method receives and return
// canned data whose SHAPE matches the real SDK (images.generate ->
// { data: [{ b64_json }] }; moderations.create -> { results: [...] }).
// ---------------------------------------------------------------------------

const imagesGenerateCalls: unknown[] = [];
const moderationsCreateCalls: unknown[] = [];

// Toggle to drive the "no image data" error path.
let nextImageB64: string | undefined = "QUJDREVG"; // "ABCDEF" base64-ish sample

mock.module("openai", () => {
  class FakeOpenAI {
    apiKey: string | undefined;
    images: { generate: (params: unknown) => Promise<unknown> };
    moderations: { create: (params: unknown) => Promise<unknown> };

    constructor(opts: { apiKey?: string } = {}) {
      this.apiKey = opts.apiKey;
      this.images = {
        generate: async (params: unknown) => {
          imagesGenerateCalls.push(params);
          return {
            data: nextImageB64 === undefined ? [{}] : [{ b64_json: nextImageB64 }],
          };
        },
      };
      this.moderations = {
        create: async (params: unknown) => {
          moderationsCreateCalls.push(params);
          return {
            id: "modr-fake",
            model: "omni-moderation-latest",
            results: [
              {
                flagged: false,
                categories: { violence: false },
                category_scores: { violence: 0.0001 },
              },
            ],
          };
        },
      };
    }
  }
  return { default: FakeOpenAI };
});

// Import AFTER mock.module so the module under test binds the fake SDK.
const { generateOpenAISprite, moderatePrompt } = await import("./openai");

const palette: MakeCodePalette = {
  ".": "rgba(0,0,0,0)",
  "1": "#FFFFFF",
  "f": "#000000",
};

const baseSettings: OpenAIGenerationSettings = {
  prompt: "a cute green dragon",
  assetType: AssetType.Sprite,
  style: Style.Retro,
  quality: OpenAIQuality.Low,
};

beforeEach(() => {
  imagesGenerateCalls.length = 0;
  moderationsCreateCalls.length = 0;
  nextImageB64 = "QUJDREVG";
});

describe("generateOpenAISprite", () => {
  test("returns a data URL plus width/height derived from the final size (square)", async () => {
    const result = await generateOpenAISprite(baseSettings, { width: 16, height: 16 }, palette);
    expect(result.image_data).toBe("data:image/png;base64,QUJDREVG");
    expect(result.width).toBe(1024);
    expect(result.height).toBe(1024);
  });

  test("landscape intended size -> 1536x1024 dims", async () => {
    const result = await generateOpenAISprite(baseSettings, { width: 24, height: 16 }, palette);
    expect(result.width).toBe(1536);
    expect(result.height).toBe(1024);
  });

  test("portrait intended size -> 1024x1536 dims", async () => {
    const result = await generateOpenAISprite(baseSettings, { width: 16, height: 24 }, palette);
    expect(result.width).toBe(1024);
    expect(result.height).toBe(1536);
  });

  test("forwards the correct params to images.generate", async () => {
    await generateOpenAISprite(baseSettings, { width: 16, height: 16 }, palette);
    expect(imagesGenerateCalls).toHaveLength(1);
    const params = imagesGenerateCalls[0] as {
      model: string;
      prompt: string;
      n: number;
      size: string;
      quality?: string;
    };
    expect(params.model).toBe("gpt-image-1.5");
    expect(params.n).toBe(1);
    expect(params.size).toBe("1024x1024");
    expect(typeof params.prompt).toBe("string");
    // Prompt is built from settings -> contains the user prompt text.
    expect(params.prompt).toContain("a cute green dragon");
  });

  test("sets quality when non-blank", async () => {
    await generateOpenAISprite(
      { ...baseSettings, quality: "high" as OpenAIGenerationSettings["quality"] },
      { width: 16, height: 16 },
      palette,
    );
    const params = imagesGenerateCalls[0] as { quality?: string };
    expect(params.quality).toBe("high");
  });

  test("omits quality when blank/whitespace (matches the Python guard)", async () => {
    await generateOpenAISprite(
      { ...baseSettings, quality: "   " as OpenAIGenerationSettings["quality"] },
      { width: 16, height: 16 },
      palette,
    );
    const params = imagesGenerateCalls[0] as Record<string, unknown>;
    expect("quality" in params).toBe(false);
  });

  test("throws when OpenAI returns no image data", async () => {
    nextImageB64 = undefined;
    await expect(
      generateOpenAISprite(baseSettings, { width: 16, height: 16 }, palette),
    ).rejects.toThrow("OpenAI returned no image data");
  });
});

describe("moderatePrompt", () => {
  test("forwards the prompt to moderations.create with the expected model", async () => {
    const res = (await moderatePrompt("hello world")) as {
      results: Array<{ flagged: boolean }>;
    };
    expect(moderationsCreateCalls).toHaveLength(1);
    const params = moderationsCreateCalls[0] as { model: string; input: string };
    expect(params.model).toBe("omni-moderation-latest");
    expect(params.input).toBe("hello world");
    // Returns the SDK response shape unchanged.
    expect(Array.isArray(res.results)).toBe(true);
    expect(res.results[0]?.flagged).toBe(false);
  });
});
