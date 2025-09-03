import { AssetType, Crop } from "../../types/export";
import type { PostProcessingSettings } from "../../types/export";

// Default PostProcessing settings based on asset type
export const getDefaultPostProcessingSettings = (
  assetType: AssetType
): PostProcessingSettings => {
  let settings: PostProcessingSettings = {
    crop: Crop.Edges,
    removeBackground: true,
    tolerance: 30,
  };

  if (assetType === AssetType.Background) {
    settings = {
      ...settings,
      crop: Crop.Fill,
      removeBackground: false,
    };
  }

  if (assetType === AssetType.Tile) {
    settings = {
      ...settings,
      removeBackground: false,
    };
  }

  return settings;
};
