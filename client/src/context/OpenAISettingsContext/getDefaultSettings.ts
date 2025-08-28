import {
  AssetType,
  OpenAIGenerationSettings,
  OpenAIQuality,
  Style,
} from "@/types/export";

// Default OpenAI settings based on asset type
export const getDefaultOpenAISettings = (
  assetType: AssetType,
  preservePrompt?: string
): OpenAIGenerationSettings => {
  let settings: OpenAIGenerationSettings = {
    prompt: preservePrompt || "",
    assetType,
    style: Style.Retro,
    quality: OpenAIQuality.Low,
  };

  if (assetType === AssetType.Background) {
    settings = {
      ...settings,
      quality: OpenAIQuality.Medium,
    };
  }

  return settings;
};
