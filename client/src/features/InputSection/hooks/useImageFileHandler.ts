import { useCallback } from "react";

// Context imports
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { useImageImports } from "../../../context/ImageImportContext/useImageImports";
import { useLoading } from "../../../context/LoadingContext/useLoading";
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";
import { useAiModel } from "../../../context/AiModelContext/useAiModel";
import { usePixelLabSettings } from "../../../context/PixelLabSettingsContext/usePixelLabSettings";
import { useOpenAISettings } from "../../../context/OpenAISettingsContext/useOpenAISettings";
import { usePostProcessing } from "../../../context/PostProcessingContext/usePostProcessing";

// Hook imports
import { usePasteData } from "../../../features/SpriteEditor/hooks/usePasteData";
import { useColorToMakeCodeConverter } from "../../../features/InputSection/hooks/useColorToMakeCodeConverter";

// Lib imports
import {
  createCanvasFromImage,
  processImageWithSettings,
  resizeCanvasToTarget,
} from "../libs/imageProcesser";

// API imports
import {
  generateOpenAiImage,
  generatePixelLabImage,
} from "../../../api/generateImageApi";

// Type imports
import { AiModel } from "../../../types/export";

export const useImageFileHandler = () => {
  const { width, height } = useCanvasSize();
  const { setImportedImage, importedImage } = useImageImports();
  const { startGeneration, stopGeneration } = useLoading();
  const { pasteSpriteData } = usePasteData();
  const { convertImage } = useColorToMakeCodeConverter();
  const { selectedModel } = useAiModel();
  const { settings: pixelLabSettings } = usePixelLabSettings();
  const { settings: openAISettings } = useOpenAISettings();
  const { settings: postProcessingSettings } = usePostProcessing();
  const { palette } = usePaletteSelected();

  /**
   * Converts an image file to sprite data with post-processing settings applied
   */
  const convertImageToSprite = useCallback(
    async (file?: File) => {
      const imageFile = file ?? importedImage;
      if (!imageFile) {
        console.warn("No image file available for sprite generation");
        return;
      }

      return new Promise<void>((resolve, reject) => {
        try {
          startGeneration("Processing image to sprite...");

          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new window.Image();
            img.onload = () => {
              try {
                // Create canvas from the image
                const originalCanvas = createCanvasFromImage(img);
                if (!originalCanvas) {
                  reject(new Error("Failed to create canvas from image"));
                  return;
                }

                // Process the image with settings (includes post-processing)
                const processedCanvas = processImageWithSettings(
                  originalCanvas,
                  postProcessingSettings
                );

                // Resize to target dimensions
                const resizedCanvas = resizeCanvasToTarget(
                  processedCanvas,
                  width,
                  height
                );
                if (!resizedCanvas) {
                  reject(new Error("Failed to resize canvas"));
                  return;
                }

                // Get image data and convert to sprite
                const imageData = resizedCanvas
                  .getContext("2d", { willReadFrequently: true })
                  ?.getImageData(0, 0, width, height);

                if (!imageData) {
                  reject(new Error("Failed to get image data"));
                  return;
                }

                const spriteData = convertImage(imageData, width, height);
                pasteSpriteData(spriteData);
                resolve();
              } catch (error) {
                console.error("Error processing image:", error);
                reject(error);
              } finally {
                stopGeneration();
              }
            };
            img.onerror = () => {
              reject(new Error("Failed to load image"));
              stopGeneration();
            };
            img.src = e.target?.result as string;
          };
          reader.onerror = () => {
            reject(new Error("Failed to read image file"));
            stopGeneration();
          };
          reader.readAsDataURL(imageFile);
        } catch (error) {
          console.error("Error reading image file:", error);
          reject(error);
          stopGeneration();
        }
      });
    },
    [
      importedImage,
      postProcessingSettings,
      width,
      height,
      convertImage,
      pasteSpriteData,
      startGeneration,
      stopGeneration,
    ]
  );

  /**
   * Generates an image using AI and converts it to sprite with post-processing
   */
  const generateAIImageAndConvertToSprite = useCallback(async () => {
    try {
      startGeneration("Generating AI sprite from prompt...");

      // Generate image using selected AI model
      let response;
      if (selectedModel === AiModel.PixelLab) {
        response = await generatePixelLabImage(
          pixelLabSettings,
          { width, height },
          palette
        );
      } else if (selectedModel === AiModel.GPTImage1) {
        response = await generateOpenAiImage(
          openAISettings,
          { width, height },
          palette
        );
      } else {
        throw new Error(`Unsupported AI model: ${selectedModel}`);
      }

      // Convert base64 data URL to File
      const dataUrl = response.image_data;
      const byteString = atob(dataUrl.split(",")[1]);
      const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];

      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], "generated-sprite.png", {
        type: mimeString,
      });

      // Store the generated image and convert to sprite with post-processing
      setImportedImage(file);
      await convertImageToSprite(file);
    } catch (error) {
      console.error("Error generating AI sprite:", error);
      throw error;
    } finally {
      stopGeneration();
    }
  }, [
    startGeneration,
    stopGeneration,
    setImportedImage,
    selectedModel,
    pixelLabSettings,
    openAISettings,
    convertImageToSprite,
    width,
    height,
    palette,
  ]);

  /**
   * Handles file upload and immediately converts to sprite
   */
  const importImageManually = useCallback(
    async (file: File) => {
      setImportedImage(file);
      await convertImageToSprite(file);
    },
    [setImportedImage, convertImageToSprite]
  );

  return {
    importImageManually,
    convertImageToSprite,
    generateAIImageAndConvertToSprite,
    importedImage,
  };
};
