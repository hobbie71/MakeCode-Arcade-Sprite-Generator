import { test, expect, describe } from "bun:test";
import {
  // enums
  AssetType,
  AssetTypeSchema,
  // palette
  MakeCodePaletteSchema,
  // wire
  SizeSchema,
  BaseGenerationSettingsSchema,
  OpenAIGenerationSettingsSchema,
  OpenAISpriteRequestSchema,
  ModerationRequestSchema,
  GenerateImageResponseSchema,
  ModerationResponseSchema,
} from "./index";

describe("barrel index re-exports", () => {
  test("re-exports the enum schemas and enum objects", () => {
    expect(AssetTypeSchema).toBeDefined();
    expect(AssetType.Sprite).toBe("sprite");
  });

  test("re-exports the palette schema", () => {
    expect(MakeCodePaletteSchema).toBeDefined();
    expect(MakeCodePaletteSchema.safeParse({ "1": "#fff" }).success).toBe(true);
  });

  test("re-exports every wire schema", () => {
    expect(SizeSchema).toBeDefined();
    expect(BaseGenerationSettingsSchema).toBeDefined();
    expect(OpenAIGenerationSettingsSchema).toBeDefined();
    expect(OpenAISpriteRequestSchema).toBeDefined();
    expect(ModerationRequestSchema).toBeDefined();
    expect(GenerateImageResponseSchema).toBeDefined();
    expect(ModerationResponseSchema).toBeDefined();
  });

  test("the re-exported schemas are functional (parse works through the barrel)", () => {
    expect(SizeSchema.parse({ width: 8, height: 8 })).toEqual({
      width: 8,
      height: 8,
    });
    expect(ModerationRequestSchema.parse({ prompt: "hi" })).toEqual({
      prompt: "hi",
    });
  });
});
