// fallow-ignore-file code-duplication -- semantic dupes match this hook's run of context reads against other components
import { useCallback } from "react";

// Context imports
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { useImageImports } from "../../../context/ImageImportContext/useImageImports";
import { useLoading } from "../../../context/LoadingContext/useLoading";
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";
import { useAiModel } from "../../../context/AiModelContext/useAiModel";
import { useOpenAISettings } from "../../../context/OpenAISettingsContext/useOpenAISettings";
import { usePostProcessing } from "../../../context/PostProcessingContext/usePostProcessing";
import { useError } from "../../../context/ErrorContext/useError";

// Hook imports
import { usePasteData } from "../../../features/SpriteEditor/hooks/usePasteData";
import { useProcessSourceToCanvas } from "./useProcessSourceToCanvas";

// Utils imports
import { validatePrompt } from "../utils/promptModeration";

// API imports
import { generateOpenAiImage } from "../../../api/generateImageApi";

// Type imports
import { AiModel } from "../../../types/export";
import type { PostProcessingSettings } from "../../../types/export";

/**
 * Decodes a base64 data URL into a File
 */
const dataUrlToFile = (dataUrl: string, filename: string): File => {
  const byteString = atob(dataUrl.split(",")[1]);
  const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([ab], { type: mimeString });
  return new File([blob], filename, { type: mimeString });
};

export const useImageFileHandler = () => {
  const { width, height } = useCanvasSize();
  const {
    setImportedImage,
    importedImage,
    sourceImage,
    setSourceImage,
    setSourceFrame,
  } = useImageImports();
  const { startGeneration, stopGeneration, setGenerationMessage } =
    useLoading();
  const { pasteCanvas } = usePasteData();
  const { selectedModel } = useAiModel();
  const { settings: openAISettings } = useOpenAISettings();
  const { settings: postProcessingSettings } = usePostProcessing();
  const { palette } = usePaletteSelected();
  const { setError } = useError();

  /**
   * Caches a file as the imported + re-processable source WITHOUT committing it
   * to the editor canvas. Used by the studio Generate modal, which hands the
   * source off to Resize & Process instead of pasting immediately.
   */
  const stageSource = useCallback(
    (file: File) => {
      setImportedImage(file);
      setSourceImage(file);
    },
    [setImportedImage, setSourceImage]
  );

  const processSourceToCanvas = useProcessSourceToCanvas();

  /**
   * Converts an image file to sprite data with post-processing settings applied,
   * then commits the result to the editor canvas.
   *
   * `overrides` lets a caller process at explicit dimensions/settings instead of
   * the live editor state — the Resize & Process modal stages its size + settings
   * locally and passes them here on Apply, so re-processing doesn't depend on the
   * canvas-size context having already been mutated.
   */
  const processImageToSprite = useCallback(
    async (
      file?: File,
      overrides?: {
        width?: number;
        height?: number;
        settings?: PostProcessingSettings;
      }
    ) => {
      setError(null);

      const imageFile = file ?? importedImage;
      if (!imageFile) {
        setError("No Image File Available for Sprite Generation");
        return;
      }

      try {
        startGeneration("Processing Image to Sprite");

        const { canvas, frame } = await processSourceToCanvas(
          imageFile,
          overrides?.width ?? width,
          overrides?.height ?? height,
          overrides?.settings ?? postProcessingSettings
        );

        // Upload Canvas to UI Sprite Editor
        pasteCanvas(canvas);
        setSourceFrame(frame);
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
      processSourceToCanvas,
      postProcessingSettings,
      width,
      height,
      pasteCanvas,
      setSourceFrame,
    ]
  );

  /**
   * Generates an image using AI and converts it to sprite with post-processing
   */
  const generateAIImageAndConvertToSprite = useCallback(async (options?: {
    commit?: boolean;
  }) => {
    // commit=true (default): paste the result into the editor (hero flow).
    // commit=false: cache the source only and let Resize & Process commit it.
    const commit = options?.commit ?? true;
    setError(null);

    // Validate Prompt then Generate AI Image

    try {
      startGeneration("Validating Prompt");

      let response;
      if (selectedModel === AiModel.GPTImage) {
        const prompt = openAISettings.prompt;

        const isValid = await validatePrompt(prompt, setError);

        if (!isValid) return;

        setGenerationMessage("Generating AI Image");

        response = await generateOpenAiImage(
          openAISettings,
          { width, height },
          palette
        );
      } else {
        throw new Error(`Unsupported AI model: ${selectedModel}`);
      }

      // Convert Data To Image File
      const file = dataUrlToFile(response.image_data, "generated-sprite.png");

      // Cache the original generated image so re-processing (resize) is free.
      setImportedImage(file);
      setSourceImage(file);
      if (commit) await processImageToSprite(file);
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
    setSourceImage,
    selectedModel,
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
      // Cache the original uploaded image so re-processing (resize) is free.
      setImportedImage(file);
      setSourceImage(file);
      await processImageToSprite(file);
    },
    [setImportedImage, setSourceImage, processImageToSprite]
  );

  return {
    importImageManually,
    generateAIImageAndConvertToSprite,
    importedImage,
    sourceImage,
    setSourceImage,
    stageSource,
    processImageToSprite,
    processSourceToCanvas,
  };
};
