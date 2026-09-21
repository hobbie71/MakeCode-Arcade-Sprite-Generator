import { useCallback } from "react";

import { useMakeCodeColorConverter } from "./useMakeCodeColorConverter";
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
import {
  fullFrame,
  letterboxFrame,
  subFrame,
  type SourceFrame,
} from "../utils/sourceFrame";
import { Crop } from "../../../types/export";
import type { PostProcessingSettings } from "../../../types/export";

/**
 * The image → sprite processing pipeline as a callback. All inputs are passed
 * explicitly (no editor-state coupling) so callers can render a preview of
 * *pending* settings before applying them.
 *
 * Shared by `processImageToSprite` (which pastes the canvas into the editor)
 * and the Resize & Process modal's live preview (which renders it to a data
 * URL). Pipeline:
 *   1. Remove background  2. Snap to MakeCode palette
 *   3. Trim / fill        4. Scale to the target size
 *
 * `frame` is the region of the original the canvas ends up showing, so the
 * Source panel can crop the full-res original identically for free.
 */
export const useProcessSourceToCanvas = () => {
  const { mapCanvasToMakeCodeColors } = useMakeCodeColorConverter();

  return useCallback(
    async (
      file: File,
      targetWidth: number,
      targetHeight: number,
      settings: PostProcessingSettings
    ): Promise<{ canvas: HTMLCanvasElement; frame: SourceFrame }> => {
      const imgElement = await fileToImageElement(file);
      let canvas = createCanvasFromImage(imgElement);
      let frame = fullFrame(canvas.width, canvas.height);

      // 1. Remove background
      if (settings.removeBackground) {
        canvas = removeBackground(canvas, settings.tolerance);
      }

      // 2. Convert colors to MakeCode palette (required)
      canvas = mapCanvasToMakeCodeColors(canvas, 1);

      // 3. Trim or fill
      if (settings.crop === Crop.Edges) {
        const trimmed = cropToVisibleContent(canvas);
        frame = subFrame(frame, canvas.width, canvas.height, trimmed.rect);
        canvas = trimmed.canvas;
      } else if (settings.crop === Crop.Fill) {
        const filled = fillToEdges(canvas, targetWidth, targetHeight);
        frame = subFrame(frame, canvas.width, canvas.height, filled.rect);
        canvas = filled.canvas;
      }

      // 4. Scale to target
      const scaled = scaleCanvasToTarget(canvas, targetWidth, targetHeight);
      frame = letterboxFrame(
        frame,
        canvas.width,
        canvas.height,
        targetWidth,
        targetHeight,
        scaled.placement
      );
      return { canvas: scaled.canvas, frame };
    },
    [mapCanvasToMakeCodeColors]
  );
};
