import { AiModel, AssetType } from "@/types/export";

// Default OpenAI settings based on asset type
export const getDefaultAiModelSettings = (assetType: AssetType): AiModel => {
  let model = AiModel.GPTImage1;

  if (assetType === AssetType.Background) {
    model = AiModel.PixelLab;
  }

  return model;
};
