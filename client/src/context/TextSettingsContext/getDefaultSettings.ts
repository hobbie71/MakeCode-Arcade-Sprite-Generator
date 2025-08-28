import {
  AssetType,
  Style,
  TextExportSettings,
  GenerationView,
  GenerationDirection,
  GenerationOutline,
  AiModel,
  Quality,
} from "@/types/export";

// Default settings based on asset type
export const getDefaultTextExportSettings = (
  assetType: AssetType,
  currentPrompt?: string
): TextExportSettings => {
  let settings: TextExportSettings = {
    prompt: currentPrompt || "",
    AiModel: AiModel.PixelLab,
    quality: Quality.Medium,
    removeBackground: true,
    cropEdges: true,
    tolerance: 30,
    assetType: AssetType.Sprite,
    style: Style.Retro,
    addBackground: false,
    fitFullCanvasSize: false,
    view: GenerationView.Auto,
    direction: GenerationDirection.Auto,
    outline: GenerationOutline.Auto,
  };

  if (assetType === AssetType.Background) {
    settings = {
      ...settings,
      removeBackground: false,
      cropEdges: false,
      assetType: AssetType.Background,
      fitFullCanvasSize: true,
    };
  }

  return settings;
};
