// Component imports
import ImageUploadForm from "./components/ImageUploadForm";
import Button from "../../../../components/Button";
import PostProcessingSection from "../../components/PostProcessingSection";

// Hook imports
import { useImageFileHandler } from "../../hooks/useImageFileHandler";

// Context imports
import { useLoading } from "../../../../context/LoadingContext/useLoading";

const ImageToSpriteSection = () => {
  const { importedImage, processImageToSprite } = useImageFileHandler();
  const { isGenerating } = useLoading();

  return (
    <div className="">
      <PostProcessingSection />

      <h4 className="heading-4">Upload Image</h4>

      <ImageUploadForm />

      {importedImage ? (
        <Button
          onClick={() => processImageToSprite()}
          isLoading={isGenerating}
          variant="primary"
          className="w-full">
          Reprocess Image
        </Button>
      ) : (
        <Button
          onClick={() => processImageToSprite()}
          isLoading={isGenerating}
          className="w-full">
          Process Image
        </Button>
      )}
    </div>
  );
};

export default ImageToSpriteSection;
