// Component imports
import ImageUploadForm from "./components/ImageUploadForm";
import Button from "../../../../components/Button";
import PostProcessingSection from "../TextToSpriteSection/components/PostProcessingSection";

// Hook imports
import { useImageFileHandler } from "../../hooks/useImageFileHandler";

// Context imports
import { useLoading } from "../../../../context/LoadingContext/useLoading";

const ImageToSpriteSection = () => {
  const { importedImage, convertImageToSprite } = useImageFileHandler();
  const { isGenerating } = useLoading();

  return (
    <div className="">
      <PostProcessingSection />
      <ImageUploadForm />

      {importedImage ? (
        <Button
          onClick={() => convertImageToSprite()}
          isLoading={isGenerating}
          variant="primary"
          className="w-full">
          Reprocess Image
        </Button>
      ) : (
        <Button
          onClick={() => convertImageToSprite()}
          isLoading={isGenerating}
          className="w-full">
          Process Image
        </Button>
      )}
    </div>
  );
};

export default ImageToSpriteSection;
