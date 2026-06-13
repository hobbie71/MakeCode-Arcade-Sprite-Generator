import { useEffect } from "react";

// Component imports
import AiPromptInput from "../components/AiPromptInput";

// Hooks imports
import { useOpenAISettings } from "../../../../../context/OpenAISettingsContext/useOpenAISettings";
import { useAssetType } from "../../../../../context/AssetTypeContext/useAssetType";
import { useLoading } from "../../../../../context/LoadingContext/useLoading";

/** Text-to-sprite input. Generation quality is forced to "low" server-side
 *  (Medium/High were removed), so there is no quality picker — just the prompt. */
const OpenAISettingsSection = () => {
  const { selectedAsset } = useAssetType();
  const { updateSetting, resetToDefaults } = useOpenAISettings();
  const { isGenerating } = useLoading();

  // Reset settings when asset type changes
  useEffect(() => {
    resetToDefaults(selectedAsset);
  }, [selectedAsset, resetToDefaults]);

  return (
    <div className="form-group">
      <AiPromptInput
        onSubmit={(prompt) => updateSetting("prompt", prompt)}
        disabled={isGenerating}
      />
    </div>
  );
};

export default OpenAISettingsSection;
