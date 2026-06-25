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
import { useMakeCodeColorConverter } from "./useMakeCodeColorConverter";

// Utils imports
import {
  createCanvasFromImage,
  fileToImageElement,
} from "../utils/imageProcessers";
import {
  removeBackground,
  cropToVisibleContent,
  fillToEdges,
  scaleCanvasToTarget,
} from "../utils/canvasProcessing";
import { validatePrompt } from "../utils/promptModeration";

// API imports
import { generateOpenAiImage } from "../../../api/generateImageApi";

// Ad gate imports
import { runWithAdGate } from "../../../ads/runWithAdGate";
import { showRewardedAd } from "../../../ads/ayet";

// Type imports
import { AiModel, Crop } from "../../../types/export";
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
  const { setImportedImage, importedImage, sourceImage, setSourceImage } =
    useImageImports();
  const { startGeneration, stopGeneration, setGenerationMessage } =
    useLoading();
  const { pasteCanvas } = usePasteData();
  const { mapCanvasToMakeCodeColors } = useMakeCodeColorConverter();
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

  /**
   * Runs the image → sprite processing pipeline on a source file and returns the
   * resulting canvas WITHOUT committing it to the editor. All inputs are passed
   * explicitly (no editor-state coupling) so callers can render a preview of
   * *pending* settings before applying them.
   *
   * Shared by `processImageToSprite` (which pastes the canvas into the editor)
   * and the Resize & Process modal's live preview (which renders it to a data
   * URL). Pipeline:
   *   1. Remove background  2. Snap to MakeCode palette
   *   3. Trim / fill        4. Scale to the target size
   */
  const processSourceToCanvas = useCallback(
    async (
      file: File,
      targetWidth: number,
      targetHeight: number,
      settings: PostProcessingSettings
    ): Promise<HTMLCanvasElement> => {
      const imgElement = await fileToImageElement(file);
      let canvas = createCanvasFromImage(imgElement);

      // 1. Remove background
      if (settings.removeBackground) {
        canvas = removeBackground(canvas, settings.tolerance);
      }

      // 2. Convert colors to MakeCode palette (required)
      canvas = mapCanvasToMakeCodeColors(canvas, 1);

      // 3. Trim or fill
      if (settings.crop === Crop.Edges) {
        canvas = cropToVisibleContent(canvas);
      } else if (settings.crop === Crop.Fill) {
        canvas = fillToEdges(canvas, targetWidth, targetHeight);
      }

      // 4. Scale to target
      return scaleCanvasToTarget(canvas, targetWidth, targetHeight);
    },
    [mapCanvasToMakeCodeColors]
  );

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

        const canvas = await processSourceToCanvas(
          imageFile,
          overrides?.width ?? width,
          overrides?.height ?? height,
          overrides?.settings ?? postProcessingSettings
        );

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
      processSourceToCanvas,
      postProcessingSettings,
      width,
      height,
      pasteCanvas,
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

        response = await runWithAdGate(
          generateOpenAiImage(openAISettings, { width, height }, palette),
          () => showRewardedAd()
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
