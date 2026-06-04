import { useCallback } from "react";

// Context imports
import { usePreviewCanvas } from "../../../context/PreviewCanvasContext/usePreviewCanvas";
import { useColorSelected } from "../contexts/ColorSelectedContext/useColorSelected";
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";
import { useStrokeSize } from "../contexts/StrokeSizeContext/useStrokeSize";
import { useShapeMode } from "../contexts/ShapeModeContext/useShapeMode";

// Lib imports
import {
  drawPixelOnCanvas,
  drawPixelsOnCanvas,
} from "../libs/drawPixelOnCanvas";
import {
  getLineCoordinates,
  getCircleCoordinates,
  getSquareCoordinates,
  getFilledCircleCoordinates,
  getFilledSquareCoordinates,
} from "../libs/getShapeCoordinates";

// Type imports
import { PIXEL_SIZE } from "../constants/canvas";

// Type imports
import type { Coordinates } from "../../../types/pixel";
import type { MakeCodeColor } from "../../../types/color";

export const useCanvasPreview = () => {
  const { previewCanvasRef } = usePreviewCanvas();
  const { color } = useColorSelected();
  const { palette } = usePaletteSelected();
  const { strokeSize } = useStrokeSize();
  const { shapeMode } = useShapeMode();

  const clearPreview = useCallback(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [previewCanvasRef]);

  const drawDotPreview = useCallback(
    (position: Coordinates, previewColor: MakeCodeColor = color) => {
      const canvas = previewCanvasRef.current;
      if (!canvas) return;

      clearPreview();

      drawPixelOnCanvas(
        canvas,
        position,
        previewColor,
        palette,
        PIXEL_SIZE,
        strokeSize
      );
    },
    [clearPreview, previewCanvasRef, color, palette, strokeSize]
  );

  const drawLinePreview = useCallback(
    (startCoordinates: Coordinates, endCoordinates: Coordinates) => {
      const canvas = previewCanvasRef.current;
      if (!canvas) return;

      clearPreview();

      const coordinates = getLineCoordinates(startCoordinates, endCoordinates);
      drawPixelsOnCanvas(
        canvas,
        coordinates,
        color,
        palette,
        PIXEL_SIZE,
        strokeSize
      );
    },
    [clearPreview, color, palette, previewCanvasRef, strokeSize]
  );

  const drawSquarePreview = useCallback(
    (startCoordinates: Coordinates, endCoordinates: Coordinates) => {
      const canvas = previewCanvasRef.current;
      if (!canvas) return;

      clearPreview();

      const coordinates =
        shapeMode === "fill"
          ? getFilledSquareCoordinates(startCoordinates, endCoordinates)
          : getSquareCoordinates(startCoordinates, endCoordinates);
      drawPixelsOnCanvas(
        canvas,
        coordinates,
        color,
        palette,
        PIXEL_SIZE,
        strokeSize
      );
    },
    [clearPreview, color, palette, previewCanvasRef, strokeSize, shapeMode]
  );

  const drawCirclePreview = useCallback(
    (startCoordinates: Coordinates, endCoordinates: Coordinates) => {
      const canvas = previewCanvasRef.current;
      if (!canvas) return;

      clearPreview();

      const coordinates =
        shapeMode === "fill"
          ? getFilledCircleCoordinates(startCoordinates, endCoordinates)
          : getCircleCoordinates(startCoordinates, endCoordinates);
      drawPixelsOnCanvas(
        canvas,
        coordinates,
        color,
        palette,
        PIXEL_SIZE,
        strokeSize
      );
    },
    [clearPreview, color, palette, previewCanvasRef, strokeSize, shapeMode]
  );

  return {
    clearPreview,
    drawDotPreview,
    drawLinePreview,
    drawSquarePreview,
    drawCirclePreview,
  };
};
