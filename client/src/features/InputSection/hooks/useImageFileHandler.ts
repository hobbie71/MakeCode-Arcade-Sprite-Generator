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
import { useError } from "../../../context/ErrorContext/useError";

// Hook imports
import { usePasteData } from "../../../features/SpriteEditor/hooks/usePasteData";
import { useMakeCodeColorConverter } from "./useMakeCodeColorConverter";

// Lib imports
import { createCanvasFromImage } from "../utils/imageProcessers";

// Utils imports
import { fileToImageElement } from "../utils/imageProcessers";
import {
  removeBackground,
  cropToVisibleContent,
  fillToEdges,
  scaleCanvasToTarget,
} from "../utils/canvasProcessing";
import { validatePrompt } from "../utils/promptModeration";

// API imports
import {
  generateOpenAiImage,
  generatePixelLabImage,
} from "../../../api/generateImageApi";

// Type imports
import { AiModel, Crop } from "../../../types/export";

export const useImageFileHandler = () => {
  const { width, height } = useCanvasSize();
  const { setImportedImage, importedImage } = useImageImports();
  const { startGeneration, stopGeneration, setGenerationMessage } =
    useLoading();
  const { pasteCanvas } = usePasteData();
  const { mapCanvasToMakeCodeColors } = useMakeCodeColorConverter();
  const { selectedModel } = useAiModel();
  const { settings: pixelLabSettings } = usePixelLabSettings();
  const { settings: openAISettings } = useOpenAISettings();
  const { settings: postProcessingSettings } = usePostProcessing();
  const { palette } = usePaletteSelected();
  const { setError } = useError();

  /**
   * Converts an image file to sprite data with post-processing settings applied
   */

  const processImageToSprite = useCallback(
    async (file?: File) => {
      setError(null);

      const imageFile = file ?? importedImage;
      if (!imageFile) {
        setError("No Image File Available for Sprite Generation");
        return;
      }

      try {
        startGeneration("Processing Image to Sprite");

        // Creates Image Element
        const imgElement = await fileToImageElement(imageFile);

        // Creates Canvas with Image Drawn
        let canvas: HTMLCanvasElement | null =
          createCanvasFromImage(imgElement);

        /**
         * Image Processing Pipeline
         * 1. Remove Background
         * 2. Convert Color to MakeCodeColors
         * 3. Trim or Fill Canvas
         * 4. Scale Canvas
         */

        // 1. Remove Background

        if (postProcessingSettings.removeBackground) {
          canvas = removeBackground(canvas, postProcessingSettings.tolerance);
        }

        // 2. Convert Color to MakeCodeColor (Required)

        canvas = mapCanvasToMakeCodeColors(canvas, 1);

        // 3. Trim or Fill Canvas

        if (postProcessingSettings.crop === Crop.Edges) {
          canvas = cropToVisibleContent(canvas);
        } else if (postProcessingSettings.crop === Crop.Fill) {
          canvas = fillToEdges(canvas, width, height);
        }

        // 4. Scale Canvas

        canvas = scaleCanvasToTarget(canvas, width, height);

        // Upload Canvas to UI Sprite Editor

        pasteCanvas(canvas);
        stopGeneration();
      } catch (error) {
        setError(String(error));
        stopGeneration();
      }
    },
    [
      importedImage,
      setError,
      startGeneration,
      stopGeneration,
      mapCanvasToMakeCodeColors,
      postProcessingSettings,
      width,
      height,
      pasteCanvas,
    ]
  );

  /**
   * Generates an image using AI and converts it to sprite with post-processing
   */
  const generateAIImageAndConvertToSprite = useCallback(async () => {
    setError(null);

    // Validate Prompt then Generate AI Image

    try {
      startGeneration("Validating Prompt");

      let response;
      if (selectedModel === AiModel.PixelLab) {
        const prompt = pixelLabSettings.prompt;

        const isValid = await validatePrompt(
          prompt,
          setError,
          setGenerationMessage
        );

        if (!isValid) return;

        setGenerationMessage("Generating AI Image");
        response = await generatePixelLabImage(
          pixelLabSettings,
          { width, height },
          palette
        );
      } else if (selectedModel === AiModel.GPTImage1) {
        const prompt = openAISettings.prompt;

        const isValid = await validatePrompt(
          prompt,
          setError,
          setGenerationMessage
        );

        if (!isValid) return;

        response = await generateOpenAiImage(
          openAISettings,
          { width, height },
          palette
        );
      } else {
        throw new Error(`Unsupported AI model: ${selectedModel}`);
      }

      // Convert Data To Image File

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

      setImportedImage(file);
      await processImageToSprite(file);
    } catch (error) {
      setError("Error generating AI sprite: " + error);
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
    width,
    height,
    palette,
    setError,
    processImageToSprite,
    setGenerationMessage,
  ]);

  /**
   * Handles file upload and immediately converts to sprite
   */
  const importImageManually = useCallback(
    async (file: File) => {
      setImportedImage(file);
      await processImageToSprite(file);
    },
    [setImportedImage, processImageToSprite]
  );

  return {
    importImageManually,
    generateAIImageAndConvertToSprite,
    importedImage,
    processImageToSprite,
  };
};
