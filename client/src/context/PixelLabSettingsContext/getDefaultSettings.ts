import {
  AssetType,
  PixelLabQuality,
  Style,
  GenerationView,
  GenerationDirection,
  GenerationOutline,
} from "../../types/export";
import type { PixelLabGenerationSettings } from "../../types/export";

// Default PixelLab settings based on asset type
export const getDefaultPixelLabSettings = (
  assetType: AssetType,
  preservePrompt?: string
): PixelLabGenerationSettings => {
  let settings: PixelLabGenerationSettings = {
    prompt: preservePrompt || "",
    assetType,
    style: Style.Retro,
    addBackground: false,
    fitFullCanvasSize: false,
    quality: PixelLabQuality.Auto,
    view: GenerationView.Auto,
    direction: GenerationDirection.Auto,
    outline: GenerationOutline.Auto,
  };

  if (assetType === AssetType.Background) {
    settings = {
      ...settings,
      fitFullCanvasSize: true,
      addBackground: true,
    };
  }

  return settings;
};
