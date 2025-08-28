import { AssetType, PostProcessingSettings } from "@/types/export";

// Default PostProcessing settings based on asset type
export const getDefaultPostProcessingSettings = (
  assetType: AssetType
): PostProcessingSettings => {
  let settings: PostProcessingSettings = {
    cropEdges: true,
    removeBackground: true,
    tolerance: 30,
  };

  if (assetType === AssetType.Background) {
    settings = {
      ...settings,
      cropEdges: false,
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
