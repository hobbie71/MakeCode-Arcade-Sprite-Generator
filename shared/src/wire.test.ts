import { test, expect, describe } from "bun:test";
import {
  SizeSchema,
  BaseGenerationSettingsSchema,
  OpenAIGenerationSettingsSchema,
  OpenAISpriteRequestSchema,
  ModerationRequestSchema,
  GenerateImageResponseSchema,
  ModerationResponseSchema,
} from "./wire";
import { AssetType } from "./enums";

describe("SizeSchema", () => {
  test("accepts integer width/height", () => {
    expect(SizeSchema.parse({ width: 16, height: 16 })).toEqual({
      width: 16,
      height: 16,
    });
  });

  test("rejects non-integer (float) dimensions", () => {
    expect(SizeSchema.safeParse({ width: 16.5, height: 16 }).success).toBe(false);
    expect(SizeSchema.safeParse({ width: 16, height: 0.1 }).success).toBe(false);
  });

  test("rejects non-number / missing fields", () => {
    expect(SizeSchema.safeParse({ width: "16", height: 16 }).success).toBe(false);
    expect(SizeSchema.safeParse({ width: 16 }).success).toBe(false);
    expect(SizeSchema.safeParse({}).success).toBe(false);
  });

  test("accepts negative and zero integers (no range constraint)", () => {
    expect(SizeSchema.parse({ width: 0, height: -8 })).toEqual({
      width: 0,
      height: -8,
    });
  });
});

describe("BaseGenerationSettingsSchema", () => {
  const valid = {
    prompt: "a friendly dragon",
    assetType: AssetType.Sprite,
  };

  test("accepts a valid settings object", () => {
    expect(BaseGenerationSettingsSchema.parse(valid)).toEqual(valid);
  });

  test("rejects an unknown assetType", () => {
    const result = BaseGenerationSettingsSchema.safeParse({
      ...valid,
      assetType: "spaceship",
    });
    expect(result.success).toBe(false);
  });

  test("rejects a non-string prompt", () => {
    expect(
      BaseGenerationSettingsSchema.safeParse({ ...valid, prompt: 42 }).success,
    ).toBe(false);
  });

  test("does NOT carry a quality field (base only)", () => {
    const parsed = BaseGenerationSettingsSchema.parse(valid);
    expect("quality" in parsed).toBe(false);
  });
});

describe("OpenAIGenerationSettingsSchema", () => {
  const base = {
    prompt: "a knight",
    assetType: AssetType.Tile,
  };

  test("accepts a valid settings object", () => {
    expect(OpenAIGenerationSettingsSchema.parse(base)).toEqual(base);
  });

  test("does NOT carry a quality field (forced to low server-side)", () => {
    const parsed = OpenAIGenerationSettingsSchema.parse(base);
    expect("quality" in parsed).toBe(false);
  });

  test("inherits base validation (rejects bad assetType)", () => {
    expect(
      OpenAIGenerationSettingsSchema.safeParse({ ...base, assetType: "nope" })
        .success,
    ).toBe(false);
  });
});

describe("OpenAISpriteRequestSchema", () => {
  const validRequest = {
    settings: {
      prompt: "a green slime",
      assetType: AssetType.Sprite,
    },
    size: { width: 16, height: 16 },
    palette: { ".": "rgba(0,0,0,0)", "1": "#FFFFFF" },
  };

  test("accepts a full valid request", () => {
    const parsed = OpenAISpriteRequestSchema.parse(validRequest);
    expect(parsed.settings.prompt).toBe("a green slime");
    expect(parsed.size).toEqual({ width: 16, height: 16 });
    expect(parsed.palette["1"]).toBe("#FFFFFF");
  });

  test("rejects when settings is missing", () => {
    const { settings, ...rest } = validRequest;
    expect(OpenAISpriteRequestSchema.safeParse(rest).success).toBe(false);
  });

  test("rejects when size is missing", () => {
    const { size, ...rest } = validRequest;
    expect(OpenAISpriteRequestSchema.safeParse(rest).success).toBe(false);
  });

  test("rejects when palette is missing", () => {
    const { palette, ...rest } = validRequest;
    expect(OpenAISpriteRequestSchema.safeParse(rest).success).toBe(false);
  });

  test("rejects when size has a float dimension", () => {
    const result = OpenAISpriteRequestSchema.safeParse({
      ...validRequest,
      size: { width: 16.7, height: 16 },
    });
    expect(result.success).toBe(false);
  });

  test("rejects when palette has a non-string value", () => {
    const result = OpenAISpriteRequestSchema.safeParse({
      ...validRequest,
      palette: { "1": 123 },
    });
    expect(result.success).toBe(false);
  });
});

describe("ModerationRequestSchema", () => {
  test("accepts a string prompt", () => {
    expect(ModerationRequestSchema.parse({ prompt: "hello" })).toEqual({
      prompt: "hello",
    });
  });

  test("rejects a missing or non-string prompt", () => {
    expect(ModerationRequestSchema.safeParse({}).success).toBe(false);
    expect(ModerationRequestSchema.safeParse({ prompt: 5 }).success).toBe(false);
  });
});

describe("GenerateImageResponseSchema", () => {
  test("accepts a valid response", () => {
    const value = {
      image_data: "data:image/png;base64,AAAA",
      width: 32,
      height: 32,
    };
    expect(GenerateImageResponseSchema.parse(value)).toEqual(value);
  });

  test("allows non-integer width/height (z.number, not int)", () => {
    const value = { image_data: "x", width: 32.5, height: 16 };
    expect(GenerateImageResponseSchema.parse(value)).toEqual(value);
  });

  test("rejects a non-string image_data", () => {
    expect(
      GenerateImageResponseSchema.safeParse({
        image_data: 123,
        width: 1,
        height: 1,
      }).success,
    ).toBe(false);
  });

  test("rejects a missing dimension", () => {
    expect(
      GenerateImageResponseSchema.safeParse({ image_data: "x", width: 1 })
        .success,
    ).toBe(false);
  });
});

describe("ModerationResponseSchema", () => {
  const valid = {
    is_appropriate: true,
    flagged: false,
    categories: { violence: false, hate: true },
    category_scores: { violence: 0.01, hate: 0.92 },
  };

  test("accepts a valid moderation response", () => {
    expect(ModerationResponseSchema.parse(valid)).toEqual(valid);
  });

  test("accepts empty category records", () => {
    const parsed = ModerationResponseSchema.parse({
      is_appropriate: true,
      flagged: false,
      categories: {},
      category_scores: {},
    });
    expect(parsed.categories).toEqual({});
  });

  test("rejects non-boolean values in categories", () => {
    expect(
      ModerationResponseSchema.safeParse({
        ...valid,
        categories: { violence: "yes" },
      }).success,
    ).toBe(false);
  });

  test("rejects non-number values in category_scores", () => {
    expect(
      ModerationResponseSchema.safeParse({
        ...valid,
        category_scores: { violence: "0.5" },
      }).success,
    ).toBe(false);
  });

  test("rejects a non-boolean is_appropriate", () => {
    expect(
      ModerationResponseSchema.safeParse({ ...valid, is_appropriate: "true" })
        .success,
    ).toBe(false);
  });
});
