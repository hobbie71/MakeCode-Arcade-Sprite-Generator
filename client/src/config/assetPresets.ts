// Single source of truth for per-asset-type defaults (client-only — these are UI
// + post-processing defaults, not wire data). The generate card's dropdown picks
// the type; the Resize & Process modal then applies the matching preset (size +
// fit + background-removal). PostProcessingContext's defaults also read from here.
import { AssetType, Crop } from "../types/export";
import type { PostProcessingSettings } from "../types/export";

export interface AssetPreset {
  /** Canvas size applied when this asset type is selected. */
  defaultSize: { width: number; height: number };
  /** Post-processing defaults fed to PostProcessingContext.resetToDefaults. */
  postProcessing: PostProcessingSettings;
}

const ASSET_PRESETS: Partial<Record<AssetType, AssetPreset>> = {
  [AssetType.Sprite]: {
    defaultSize: { width: 64, height: 64 },
    postProcessing: { removeBackground: true, crop: Crop.Edges, tolerance: 30 },
  },
  [AssetType.Background]: {
    defaultSize: { width: 160, height: 120 },
    postProcessing: { removeBackground: false, crop: Crop.Fill, tolerance: 30 },
  },
  [AssetType.Tile]: {
    defaultSize: { width: 16, height: 16 },
    postProcessing: { removeBackground: false, crop: Crop.Fill, tolerance: 30 },
  },
};

/** Look up a preset, falling back to Sprite for any type not in the map
 *  (e.g. Tilemap/Animation, which the UI never selects). */
export function getAssetPreset(type: AssetType): AssetPreset {
  return ASSET_PRESETS[type] ?? ASSET_PRESETS[AssetType.Sprite]!;
}
