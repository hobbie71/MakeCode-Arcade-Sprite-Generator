import { useImageSettings } from "@/context/ImageSettingsContext/useImageSettings";
import { useAssetType } from "@/context/AssetTypeContext/useAssetType";
import { useEffect } from "react";

export const useImageToSpriteExportSettings = () => {
  const { selectedAsset } = useAssetType();
  const { settings, updateSetting, resetToDefaults } = useImageSettings();

  // Reset settings when asset type changes
  useEffect(() => {
    resetToDefaults(selectedAsset);
  }, [selectedAsset, resetToDefaults]);

  return {
    settings,
    changeSetting: updateSetting,
    resetToDefaults: () => resetToDefaults(selectedAsset),
  };
};
