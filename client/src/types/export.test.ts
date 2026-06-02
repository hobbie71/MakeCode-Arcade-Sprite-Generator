import { test, expect, describe } from "bun:test";
import { AssetType, OpenAIQuality, Style } from "@makespritecode/shared";
import {
  ImageExportFormats,
  ALL_IMAGE_EXPORT_FORMATS,
  CodeExportFormats,
  ALL_CODE_EXPORT_FORMATS,
  ALL_ASSETS_TYPE,
  AiModel,
  ALL_AI_MODELS,
  ALL_OPENAI_QUALITYS,
  GenerationMethod,
  generationMethods,
  ALL_STYLES,
  Crop,
  ALL_CROP_OPTIONS,
  DEFAULT_TEXT_TO_SPRITE_SETTINGS,
} from "./export";

describe("export.ts re-exports of shared enums", () => {
  test("re-exports AssetType / Style / OpenAIQuality from shared", () => {
    expect(AssetType.Sprite).toBe("sprite");
    expect(Style.Retro).toBe("retro");
    expect(OpenAIQuality.Low).toBe("low");
  });
});

describe("ImageExportFormats", () => {
  test("enum carries the lowercase string values", () => {
    expect(ImageExportFormats.PNG).toBe("png");
    expect(ImageExportFormats.JPEG).toBe("jpeg");
    expect(ImageExportFormats.WEBP).toBe("webp");
  });

  test("ALL_IMAGE_EXPORT_FORMATS lists every format with a display name", () => {
    expect(ALL_IMAGE_EXPORT_FORMATS.length).toBe(3);
    expect(ALL_IMAGE_EXPORT_FORMATS.map((f) => f.format)).toEqual([
      ImageExportFormats.PNG,
      ImageExportFormats.JPEG,
      ImageExportFormats.WEBP,
    ]);
    expect(ALL_IMAGE_EXPORT_FORMATS.map((f) => f.name)).toEqual([
      "PNG",
      "JPEG",
      "WEBP",
    ]);
  });
});

describe("CodeExportFormats", () => {
  test("enum carries the expected string values", () => {
    expect(CodeExportFormats.SPRITE_EDITOR).toBe("sprite-editor");
    expect(CodeExportFormats.JAVASCRIPT).toBe("javascript");
    expect(CodeExportFormats.PYTHON).toBe("python");
  });

  test("ALL_CODE_EXPORT_FORMATS lists every code format with a display name", () => {
    expect(ALL_CODE_EXPORT_FORMATS.length).toBe(3);
    expect(ALL_CODE_EXPORT_FORMATS.map((f) => f.format)).toEqual([
      CodeExportFormats.SPRITE_EDITOR,
      CodeExportFormats.JAVASCRIPT,
      CodeExportFormats.PYTHON,
    ]);
  });
});

describe("ALL_ASSETS_TYPE", () => {
  test("offers exactly Sprite, Background and Tile (OpenAI-only catalog)", () => {
    expect(ALL_ASSETS_TYPE).toEqual([
      AssetType.Sprite,
      AssetType.Background,
      AssetType.Tile,
    ]);
  });

  test("does not include Tilemap or Animation", () => {
    expect(ALL_ASSETS_TYPE).not.toContain(AssetType.Tilemap);
    expect(ALL_ASSETS_TYPE).not.toContain(AssetType.Animation);
  });
});

describe("AiModel catalog", () => {
  test("the single supported model is gpt-image-1", () => {
    expect(AiModel.GPTImage1).toBe("gpt-image-1");
    expect(ALL_AI_MODELS.length).toBe(1);
    expect(ALL_AI_MODELS[0].model).toBe(AiModel.GPTImage1);
  });
});

describe("ALL_OPENAI_QUALITYS", () => {
  test("only Low and Medium are offered (no High)", () => {
    expect(ALL_OPENAI_QUALITYS.map((q) => q.quality)).toEqual([
      OpenAIQuality.Low,
      OpenAIQuality.Medium,
    ]);
    expect(ALL_OPENAI_QUALITYS.map((q) => q.name)).toEqual(["Low", "Medium"]);
  });
});

describe("GenerationMethod", () => {
  test("enum maps to image / text wire values", () => {
    expect(GenerationMethod.ImageToSprite).toBe("image");
    expect(GenerationMethod.TextToSprite).toBe("text");
  });

  test("generationMethods lists text first, then image", () => {
    expect(generationMethods).toEqual([
      GenerationMethod.TextToSprite,
      GenerationMethod.ImageToSprite,
    ]);
  });
});

describe("ALL_STYLES", () => {
  test("covers all six shared Style members", () => {
    expect(ALL_STYLES.length).toBe(6);
    expect(ALL_STYLES.map((s) => s.style)).toEqual([
      Style.Retro,
      Style.Chibi,
      Style.Isometric,
      Style.Minimalist,
      Style.Modern,
      Style.Anime,
    ]);
  });

  test("every style entry has a non-empty display name", () => {
    for (const entry of ALL_STYLES) {
      expect(typeof entry.name).toBe("string");
      expect(entry.name.length).toBeGreaterThan(0);
    }
  });
});

describe("Crop and ALL_CROP_OPTIONS", () => {
  test("Crop enum values", () => {
    expect(Crop.None).toBe("");
    expect(Crop.Edges).toBe("edges");
    expect(Crop.Fill).toBe("fill");
  });

  test("ALL_CROP_OPTIONS lists each crop option with a label", () => {
    expect(ALL_CROP_OPTIONS.map((o) => o.option)).toEqual([
      Crop.None,
      Crop.Edges,
      Crop.Fill,
    ]);
    expect(ALL_CROP_OPTIONS.map((o) => o.name)).toEqual([
      "None",
      "Edges",
      "Fill",
    ]);
  });
});

describe("DEFAULT_TEXT_TO_SPRITE_SETTINGS", () => {
  test("defaults disable background removal/cropping with tolerance 30", () => {
    expect(DEFAULT_TEXT_TO_SPRITE_SETTINGS).toEqual({
      removeBackground: false,
      cropEdges: false,
      tolerance: 30,
    });
  });
});
