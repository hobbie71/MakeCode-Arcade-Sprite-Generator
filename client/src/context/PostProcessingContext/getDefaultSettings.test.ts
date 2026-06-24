import { describe, it, expect } from "bun:test";
import { AssetType, Crop } from "../../types/export";
import type { PostProcessingSettings } from "../../types/export";
import { getDefaultPostProcessingSettings } from "./getDefaultSettings";

const cases: Array<{
  name: string;
  type: AssetType;
  expected: PostProcessingSettings;
}> = [
  {
    name: "Sprite: trim edges, remove background",
    type: AssetType.Sprite,
    expected: { removeBackground: true, crop: Crop.Edges, tolerance: 30 },
  },
  {
    name: "Background: fill, keep background",
    type: AssetType.Background,
    expected: { removeBackground: false, crop: Crop.Fill, tolerance: 30 },
  },
  {
    name: "Tile: fill, keep background (crop is Fill, not Edges)",
    type: AssetType.Tile,
    expected: { removeBackground: false, crop: Crop.Fill, tolerance: 30 },
  },
];

describe("getDefaultPostProcessingSettings", () => {
  for (const { name, type, expected } of cases) {
    it(name, () => {
      expect(getDefaultPostProcessingSettings(type)).toEqual(expected);
    });
  }
});
