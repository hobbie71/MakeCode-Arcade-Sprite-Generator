import { useEffect } from "react";

// Component imports
import DefaultDropDown from "../../../../components/DefaultDropDown";
import PixelLabSettingsSection from "./components/PixelLabSettingsSection";
import OpenAISettingsSection from "./components/OpenAISettingsSection";
import PostProcessingSection from "../../components/PostProcessingSection";
import Button from "../../../../components/Button";

// Hooks imports
import { useLoading } from "../../../../context/LoadingContext/useLoading";
import { useImageFileHandler } from "../../hooks/useImageFileHandler";

// Context imports
import { useAiModel } from "../../../../context/AiModelContext/useAiModel";
import { useAssetType } from "../../../../context/AssetTypeContext/useAssetType";

// Type imports
import { ALL_AI_MODELS, AiModel } from "../../../../types/export";

const TextToSpriteSection = () => {
  const { selectedModel, setSelectedModel, setDefaultModel } = useAiModel();
  const { isGenerating } = useLoading();
  const { selectedAsset } = useAssetType();
  const {
    importedImage,
    generateAIImageAndConvertToSprite,
    processImageToSprite,
  } = useImageFileHandler();

  useEffect(() => {
    setDefaultModel(selectedAsset);
  }, [selectedAsset, setDefaultModel]);

  return (
    <div className="">
      <PostProcessingSection />

      <h4 className="heading-4">AI Settings</h4>

      {/* AI Model Selection */}
      <DefaultDropDown
        onChange={(index: number) =>
          setSelectedModel(ALL_AI_MODELS[index].model)
        }
        options={ALL_AI_MODELS}
        value={ALL_AI_MODELS.findIndex(
          (aiModel) => selectedModel === aiModel.model
        )}
        disabled={isGenerating}>
        AI Model
      </DefaultDropDown>

      {/* Render appropriate settings based on selected model */}
      {selectedModel === AiModel.PixelLab && <PixelLabSettingsSection />}
      {selectedModel === AiModel.GPTImage1 && <OpenAISettingsSection />}

      {importedImage ? (
        <>
          <Button
            onClick={() => generateAIImageAndConvertToSprite()}
            isLoading={isGenerating}
            variant="primary"
            className="w-full">
            Generate New Sprite
          </Button>
          <Button
            onClick={() => processImageToSprite()}
            isLoading={isGenerating}
            variant="secondary"
            className="w-full">
            Reprocess Image
          </Button>
        </>
      ) : (
        <Button
          onClick={() => generateAIImageAndConvertToSprite()}
          isLoading={isGenerating}
          className="w-full">
          Generate New Sprite
        </Button>
      )}
    </div>
  );
};

export default TextToSpriteSection;
