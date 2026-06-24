import { describe, it, expect } from "bun:test";
import { AssetType, Crop } from "../types/export";
import { getAssetPreset } from "./assetPresets";

describe("getAssetPreset", () => {
  it("returns the Sprite preset (64×64, trim edges, remove background)", () => {
    expect(getAssetPreset(AssetType.Sprite)).toEqual({
      defaultSize: { width: 64, height: 64 },
      postProcessing: { removeBackground: true, crop: Crop.Edges, tolerance: 30 },
    });
  });

  it("returns the Background preset (160×120, fill, keep background)", () => {
    expect(getAssetPreset(AssetType.Background)).toEqual({
      defaultSize: { width: 160, height: 120 },
      postProcessing: { removeBackground: false, crop: Crop.Fill, tolerance: 30 },
    });
  });

  it("returns the Tile preset (16×16, fill, keep background)", () => {
    expect(getAssetPreset(AssetType.Tile)).toEqual({
      defaultSize: { width: 16, height: 16 },
      postProcessing: { removeBackground: false, crop: Crop.Fill, tolerance: 30 },
    });
  });

  it("falls back to the Sprite preset for types not in the map", () => {
    expect(getAssetPreset(AssetType.Tilemap)).toEqual(getAssetPreset(AssetType.Sprite));
    expect(getAssetPreset(AssetType.Animation)).toEqual(getAssetPreset(AssetType.Sprite));
  });
});
