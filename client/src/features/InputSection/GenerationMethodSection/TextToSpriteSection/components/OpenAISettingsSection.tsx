// Component imports
import AiPromptInput from "../components/AiPromptInput";

// Hooks imports
import { useOpenAISettings } from "../../../../../context/OpenAISettingsContext/useOpenAISettings";
import { useLoading } from "../../../../../context/LoadingContext/useLoading";

interface Props {
  /** Bumped by the parent when Generate is clicked with an empty prompt → the
   *  textarea flashes red + shakes. */
  errorNonce?: number;
}

/** Text-to-sprite input. Generation quality is forced to "low" server-side
 *  (Medium/High were removed), so there is no quality picker — just the prompt.
 *  The asset type (incl. the OpenAI `assetType`) is chosen in the AssetTypeSelect
 *  dropdown beside this input, so this section only owns the prompt. */
const OpenAISettingsSection = ({ errorNonce = 0 }: Props) => {
  const { updateSetting } = useOpenAISettings();
  const { isGenerating } = useLoading();

  return (
    <div className="form-group">
      <AiPromptInput
        onSubmit={(prompt) => updateSetting("prompt", prompt)}
        disabled={isGenerating}
        errorNonce={errorNonce}
      />
    </div>
  );
};

export default OpenAISettingsSection;
