import { useCallback } from "react";

// Context imports
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useColorSelected } from "../contexts/ColorSelectedContext/useColorSelected";
import { useStrokeSize } from "../contexts/StrokeSizeContext/useStrokeSize";

// Hook imports
import { useSpriteData } from "./useSpriteData";

// Lib imports
import { drawPixelOnCanvas } from "../libs/drawPixelOnCanvas";

// Utils imports
import { getStrokeCoordinates } from "../utils/getStrokeCoordinates";

// Type imports
import type { Coordinates } from "../../../types/pixel";
import { PIXEL_SIZE } from "../constants/canvas";

export const usePencil = () => {
  const { canvasRef } = useCanvas();
  const { color } = useColorSelected();
  const { palette } = usePaletteSelected();
  const { setSpriteDataCoordinates, commitSpriteData } = useSpriteData();
  const { strokeSize } = useStrokeSize();

  const handlePointerDown = useCallback(
    (coordinates: Coordinates) => {
      if (!canvasRef.current) return;

      drawPixelOnCanvas(
        canvasRef.current,
        coordinates,
        color,
        palette,
        PIXEL_SIZE,
        strokeSize
      );

      // Get all coordinates affected by stroke size for sprite data
      const strokeCoordinates = getStrokeCoordinates(coordinates, strokeSize);
      setSpriteDataCoordinates(strokeCoordinates, color);
    },
    [canvasRef, color, palette, setSpriteDataCoordinates, strokeSize]
  );

  const handlePointerMove = useCallback(
    (coordinates: Coordinates) => {
      if (!canvasRef.current) return;

      drawPixelOnCanvas(
        canvasRef.current,
        coordinates,
        color,
        palette,
        PIXEL_SIZE,
        strokeSize
      );

      // Get all coordinates affected by stroke size for sprite data
      const strokeCoordinates = getStrokeCoordinates(coordinates, strokeSize);
      setSpriteDataCoordinates(strokeCoordinates, color);
    },
    [canvasRef, color, palette, setSpriteDataCoordinates, strokeSize]
  );

  const handlePointerUp = useCallback(() => {
    commitSpriteData();
  }, [commitSpriteData]);

  return { handlePointerDown, handlePointerMove, handlePointerUp };
};
