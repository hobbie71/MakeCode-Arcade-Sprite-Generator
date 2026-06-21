// Component imports
import AiPromptInput from "../components/AiPromptInput";

// Hooks imports
import { useOpenAISettings } from "../../../../../context/OpenAISettingsContext/useOpenAISettings";
import { useLoading } from "../../../../../context/LoadingContext/useLoading";

/** Text-to-sprite input. Generation quality is forced to "low" server-side
 *  (Medium/High were removed), so there is no quality picker — just the prompt.
 *  Per-asset-type settings (incl. the OpenAI `assetType`) are reset centrally by
 *  AssetTypeTabs → useApplyAssetPreset, so this section no longer resets them. */
const OpenAISettingsSection = () => {
  const { updateSetting } = useOpenAISettings();
  const { isGenerating } = useLoading();

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
