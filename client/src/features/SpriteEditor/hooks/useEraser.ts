import { useCallback } from "react";

// Context imports
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";
import { useStrokeSize } from "../contexts/StrokeSizeContext/useStrokeSize";

// Hook imports
import { useSpriteData } from "./useSpriteData";

// Lib imports
import { drawPixelOnCanvas } from "../libs/drawPixelOnCanvas";

// Utils imports
import { getStrokeCoordinates } from "../utils/getStrokeCoordinates";

// Type imports
import type { Coordinates } from "../../../types/pixel";
import { MakeCodeColor } from "../../../types/color";

// Constant imports
import { PIXEL_SIZE } from "../constants/canvas";

export const useEraser = () => {
  const { canvasRef } = useCanvas();
  const { setSpriteDataCoordinates, commitSpriteData } = useSpriteData();
  const { palette } = usePaletteSelected();
  const { strokeSize } = useStrokeSize();

  const handlePointerDown = useCallback(
    (coordinates: Coordinates) => {
      if (!canvasRef.current) return;

      drawPixelOnCanvas(
        canvasRef.current,
        coordinates,
        MakeCodeColor.TRANSPARENT,
        palette,
        PIXEL_SIZE,
        strokeSize
      );

      // Get all coordinates affected by stroke size for sprite data
      const strokeCoordinates = getStrokeCoordinates(coordinates, strokeSize);
      setSpriteDataCoordinates(strokeCoordinates, MakeCodeColor.TRANSPARENT);
    },
    [canvasRef, palette, setSpriteDataCoordinates, strokeSize]
  );

  const handlePointerMove = useCallback(
    (coordinates: Coordinates) => {
      if (!canvasRef.current) return;

      drawPixelOnCanvas(
        canvasRef.current,
        coordinates,
        MakeCodeColor.TRANSPARENT,
        palette,
        PIXEL_SIZE,
        strokeSize
      );

      // Get all coordinates affected by stroke size for sprite data
      const strokeCoordinates = getStrokeCoordinates(coordinates, strokeSize);
      setSpriteDataCoordinates(strokeCoordinates, MakeCodeColor.TRANSPARENT);
    },
    [canvasRef, palette, setSpriteDataCoordinates, strokeSize]
  );

  const handlePointerUp = useCallback(() => {
    commitSpriteData();
  }, [commitSpriteData]);

  return { handlePointerDown, handlePointerMove, handlePointerUp };
};
