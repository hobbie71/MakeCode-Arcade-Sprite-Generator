import { useCallback } from "react";
import type { AssetType } from "../types/export";
import { getAssetPreset } from "../config/assetPresets";
import { useCanvasSize } from "../context/CanvasSizeContext/useCanvasSize";
import { usePostProcessing } from "../context/PostProcessingContext/usePostProcessing";
import { useOpenAISettings } from "../context/OpenAISettingsContext/useOpenAISettings";

/**
 * Returns a stable callback that pushes an asset type's preset into the shared
 * contexts: canvas size, post-processing (removeBackground / crop / tolerance),
 * and the OpenAI settings' `assetType` field. The Resize & Process modal and the
 * AI generate call read these contexts, so this is the one place a type's defaults
 * are applied. OpenAI's reset preserves the typed prompt.
 */
export const useApplyAssetPreset = () => {
  const { setWidth, setHeight } = useCanvasSize();
  const { resetToDefaults: resetPostProcessing } = usePostProcessing();
  const { resetToDefaults: resetOpenAISettings } = useOpenAISettings();

  return useCallback(
    (type: AssetType) => {
      const { defaultSize } = getAssetPreset(type);
      setWidth(defaultSize.width);
      setHeight(defaultSize.height);
      resetPostProcessing(type);
      resetOpenAISettings(type);
    },
    [setWidth, setHeight, resetPostProcessing, resetOpenAISettings]
  );
};
