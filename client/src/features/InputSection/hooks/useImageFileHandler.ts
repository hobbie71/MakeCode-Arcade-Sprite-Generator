import { useCallback, useState } from "react";

// Context imports
import { useCanvasSize } from "@/context/CanvasSizeContext/useCanvasSize";
import { useImageImports } from "@/context/ImageImportContext/useImageImports";
import { useGenerationMethod } from "@/context/GenerationMethodContext/useGenerationMethod";

// Hook imports
import { usePasteData } from "@/features/SpriteEditor/hooks/usePasteData";
import { useColorToMakeCodeConverter } from "@/features/InputSection/hooks/useColorToMakeCodeConverter";
import { useImageToSpriteExportSettings } from "../GenerationMethodSection/ImageToSpriteSection/hooks/useImageToSpriteExportSettings";

// Lib imports
import {
  createCanvasFromImage,
  processImageWithSettings,
  resizeCanvasToTarget,
} from "../libs/imageProcesser";

// Type imports
import {
  GenerationMethod,
  DEFAULT_TEXT_TO_SPRITE_SETTINGS,
} from "@/types/export";

export const useImageFileHandler = () => {
  const { width, height } = useCanvasSize();
  const { setImportedImage, importedImage } = useImageImports();
  const { selectedMethod } = useGenerationMethod();
  const { pasteSpriteData } = usePasteData();
  const { convertImage } = useColorToMakeCodeConverter();
  const { settings: imageToSpriteSettings } = useImageToSpriteExportSettings();

  // Store the uploaded image for processing
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      // Store the uploaded file for processing
      setUploadedImageFile(file);
      // Store the imported file for preview
      setImportedImage(file);
    },
    [setImportedImage]
  );

  const generateSpriteFromImportedImage = useCallback(() => {
    // Use either the uploaded file or the imported image from context
    const fileToProcess = uploadedImageFile || importedImage;

    if (!fileToProcess) {
      console.warn("No image file available for sprite generation");
      return;
    }

    // Create image element from file
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        // Create canvas from the image
        const originalCanvas = createCanvasFromImage(img);
        if (!originalCanvas) return;

        // Get appropriate settings based on current generation method
        const settings =
          selectedMethod === GenerationMethod.ImageToSprite
            ? imageToSpriteSettings
            : DEFAULT_TEXT_TO_SPRITE_SETTINGS;

        // Process the image with settings
        const processedCanvas = processImageWithSettings(
          originalCanvas,
          settings
        );

        // Resize to target dimensions
        const resizedCanvas = resizeCanvasToTarget(
          processedCanvas,
          width,
          height
        );
        if (!resizedCanvas) return;

        // Get image data and convert to sprite
        const imageData = resizedCanvas
          .getContext("2d", { willReadFrequently: true })
          ?.getImageData(0, 0, width, height);

        if (!imageData) return;
        const spriteData = convertImage(imageData, width, height);
        pasteSpriteData(spriteData);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(fileToProcess);
  }, [
    uploadedImageFile,
    importedImage,
    selectedMethod,
    imageToSpriteSettings,
    width,
    height,
    convertImage,
    pasteSpriteData,
  ]);

  return { handleFile, generateSpriteFromImportedImage };
};
