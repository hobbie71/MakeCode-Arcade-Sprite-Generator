import { test, expect, describe } from "bun:test";
import { AssetType, Crop } from "../../types/export";
import { getDefaultPostProcessingSettings } from "./getDefaultSettings";

describe("getDefaultPostProcessingSettings", () => {
  test("Sprite: crop edges, remove background, tolerance 30", () => {
    const settings = getDefaultPostProcessingSettings(AssetType.Sprite);
    expect(settings).toEqual({
      crop: Crop.Edges,
      removeBackground: true,
      tolerance: 30,
    });
  });

  test("Background: crop fill, keep background", () => {
    const settings = getDefaultPostProcessingSettings(AssetType.Background);
    expect(settings.crop).toBe(Crop.Fill);
    expect(settings.removeBackground).toBe(false);
    expect(settings.tolerance).toBe(30);
  });

  test("Tile: keep background but still crop edges", () => {
    const settings = getDefaultPostProcessingSettings(AssetType.Tile);
    expect(settings.crop).toBe(Crop.Edges);
    expect(settings.removeBackground).toBe(false);
    expect(settings.tolerance).toBe(30);
  });

  test("tolerance is always 30 regardless of asset type", () => {
    for (const assetType of [
      AssetType.Sprite,
      AssetType.Background,
      AssetType.Tile,
    ]) {
      expect(getDefaultPostProcessingSettings(assetType).tolerance).toBe(30);
    }
  });

  test("only Sprite removes the background by default", () => {
    expect(
      getDefaultPostProcessingSettings(AssetType.Sprite).removeBackground
    ).toBe(true);
    expect(
      getDefaultPostProcessingSettings(AssetType.Background).removeBackground
    ).toBe(false);
    expect(
      getDefaultPostProcessingSettings(AssetType.Tile).removeBackground
    ).toBe(false);
  });
});
