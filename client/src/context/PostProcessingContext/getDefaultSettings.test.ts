import { describe, it, expect } from "bun:test";
import { AssetType, Crop } from "../../types/export";
import { getDefaultPostProcessingSettings } from "./getDefaultSettings";

describe("getDefaultPostProcessingSettings", () => {
  it("Sprite: trim edges, remove background", () => {
    expect(getDefaultPostProcessingSettings(AssetType.Sprite)).toEqual({
      removeBackground: true,
      crop: Crop.Edges,
      tolerance: 30,
    });
  });

  it("Background: fill, keep background", () => {
    expect(getDefaultPostProcessingSettings(AssetType.Background)).toEqual({
      removeBackground: false,
      crop: Crop.Fill,
      tolerance: 30,
    });
  });

  it("Tile: fill, keep background (crop is Fill, not Edges)", () => {
    expect(getDefaultPostProcessingSettings(AssetType.Tile)).toEqual({
      removeBackground: false,
      crop: Crop.Fill,
      tolerance: 30,
    });
  });
});
