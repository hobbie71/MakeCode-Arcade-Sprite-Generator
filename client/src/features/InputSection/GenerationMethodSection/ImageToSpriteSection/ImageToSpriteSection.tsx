// Component imports
import ImageUploadForm from "./components/ImageUploadForm";
import CheckBox from "../../components/CheckBox";
import NumberInputBox from "../../components/NumberInputBox";
import Button from "../../../../components/Button";

// Hook imports
import { usePostProcessing } from "@/context/PostProcessingContext/usePostProcessing";
import { useImageFileHandler } from "../../hooks/useImageFileHandler";

// Context imports
import { useLoading } from "@/context/LoadingContext/useLoading";

const ImageToSpriteSection = () => {
  const { settings, updateSetting } = usePostProcessing();
  const { importedImage, convertImageToSprite } = useImageFileHandler();
  const { isGenerating } = useLoading();

  return (
    <div className="">
      <CheckBox
        onChange={(bool) => updateSetting("cropEdges", bool)}
        checked={settings.cropEdges}>
        Crop Edges
      </CheckBox>
      <CheckBox
        onChange={(bool) => updateSetting("removeBackground", bool)}
        checked={settings.removeBackground}>
        Remove Background
      </CheckBox>
      {settings.removeBackground && (
        <NumberInputBox
          label="Tolerance"
          onChange={(num) => updateSetting("tolerance", num)}
          value={settings.tolerance}
          min={1}
          max={100}
          maxDigits={3}
        />
      )}
      <ImageUploadForm />

      {importedImage ? (
        <Button
          onClick={() => convertImageToSprite()}
          isLoading={isGenerating}
          variant="primary">
          Reprocess Image
        </Button>
      ) : (
        <Button onClick={() => convertImageToSprite()} isLoading={isGenerating}>
          Process Image
        </Button>
      )}
    </div>
  );
};

export default ImageToSpriteSection;
