import type { AssetType } from "../../types/export";
import type { PostProcessingSettings } from "../../types/export";
import { getAssetPreset } from "../../config/assetPresets";

// PostProcessing defaults per asset type — sourced from the single ASSET_PRESETS
// map so size + post-processing defaults can never drift apart.
export const getDefaultPostProcessingSettings = (
  assetType: AssetType
): PostProcessingSettings => getAssetPreset(assetType).postProcessing;
