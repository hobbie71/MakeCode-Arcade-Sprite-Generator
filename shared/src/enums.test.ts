import { test, expect, describe } from "bun:test";
import {
  AssetType,
  AssetTypeSchema,
  Style,
  StyleSchema,
  OpenAIQuality,
  OpenAIQualitySchema,
} from "./enums";

describe("AssetType", () => {
  test("enum members carry the wire string values", () => {
    expect(AssetType.Sprite).toBe("sprite");
    expect(AssetType.Background).toBe("background");
    expect(AssetType.Tile).toBe("tile");
    expect(AssetType.Tilemap).toBe("tilemap");
    expect(AssetType.Animation).toBe("animation");
  });

  test("schema accepts every member and rejects unknown strings", () => {
    for (const value of Object.values(AssetType)) {
      expect(AssetTypeSchema.parse(value)).toBe(value);
    }
    expect(AssetTypeSchema.safeParse("spaceship").success).toBe(false);
    expect(AssetTypeSchema.safeParse("Sprite").success).toBe(false); // case-sensitive
  });
});

describe("Style", () => {
  test("schema round-trips every member", () => {
    for (const value of Object.values(Style)) {
      expect(StyleSchema.parse(value)).toBe(value);
    }
    expect(StyleSchema.safeParse("baroque").success).toBe(false);
  });
});

describe("OpenAIQuality", () => {
  test("only low/medium are valid (no 'high')", () => {
    expect(OpenAIQualitySchema.parse(OpenAIQuality.Low)).toBe("low");
    expect(OpenAIQualitySchema.parse(OpenAIQuality.Medium)).toBe("medium");
    expect(OpenAIQualitySchema.safeParse("high").success).toBe(false);
  });
});
