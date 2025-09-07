import { useCallback } from "react";

// Context imports
import { usePreviewCanvas } from "../../../context/PreviewCanvasContext/usePreviewCanvas";
import { useColorSelected } from "../contexts/ColorSelectedContext/useColorSelected";
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";

// Lib imports
import {
  drawPixelOnCanvas,
  drawPixelsOnCanvas,
} from "../libs/drawPixelOnCanvas";
import {
  getLineCoordinates,
  getCircleCoordinates,
  getSquareCoordinates,
} from "../libs/getShapeCoordinates";

// Type imports
import type { Coordinates } from "../../../types/pixel";

export const useCanvasPreview = () => {
  const { previewCanvasRef } = usePreviewCanvas();
  const { color } = useColorSelected();
  const { palette } = usePaletteSelected();

  const clearPreview = useCallback(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [previewCanvasRef]);

  const drawDotPreview = useCallback(
    (position: Coordinates) => {
      const canvas = previewCanvasRef.current;
      if (!canvas) return;

      clearPreview();

      drawPixelOnCanvas(canvas, position, color, palette);
    },
    [clearPreview, previewCanvasRef, color, palette]
  );

  const drawLinePreview = useCallback(
    (startCoordinates: Coordinates, endCoordinates: Coordinates) => {
      const canvas = previewCanvasRef.current;
      if (!canvas) return;

      clearPreview();

      const coordinates = getLineCoordinates(startCoordinates, endCoordinates);
      drawPixelsOnCanvas(canvas, coordinates, color, palette);
    },
    [clearPreview, color, palette, previewCanvasRef]
  );

  const drawSquarePreview = useCallback(
    (startCoordinates: Coordinates, endCoordinates: Coordinates) => {
      const canvas = previewCanvasRef.current;
      if (!canvas) return;

      clearPreview();

      const coordinates = getSquareCoordinates(
        startCoordinates,
        endCoordinates
      );
      drawPixelsOnCanvas(canvas, coordinates, color, palette);
    },
    [clearPreview, color, palette, previewCanvasRef]
  );

  const drawCirclePreview = useCallback(
    (startCoordinates: Coordinates, endCoordinates: Coordinates) => {
      const canvas = previewCanvasRef.current;
      if (!canvas) return;

      clearPreview();

      const coordinates = getCircleCoordinates(
        startCoordinates,
        endCoordinates
      );
      drawPixelsOnCanvas(canvas, coordinates, color, palette);
    },
    [clearPreview, color, palette, previewCanvasRef]
  );

  return {
    clearPreview,
    drawDotPreview,
    drawLinePreview,
    drawSquarePreview,
    drawCirclePreview,
  };
};
