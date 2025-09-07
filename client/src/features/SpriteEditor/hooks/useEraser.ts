import { useCallback } from "react";

// Context imports
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";

// Hook imports
import { useSpriteData } from "./useSpriteData";

// Lib imports
import { drawPixelOnCanvas } from "../libs/drawPixelOnCanvas";

// Type imports
import type { Coordinates } from "../../../types/pixel";
import { MakeCodeColor } from "../../../types/color";

export const useEraser = () => {
  const { canvasRef } = useCanvas();
  const { setSpriteDataCoordinates, commitSpriteData } = useSpriteData();
  const { palette } = usePaletteSelected();

  const handlePointerDown = useCallback(
    (coordinates: Coordinates) => {
      if (!canvasRef.current) return;

      drawPixelOnCanvas(
        canvasRef.current,
        coordinates,
        MakeCodeColor.TRANSPARENT,
        palette
      );

      setSpriteDataCoordinates(coordinates, MakeCodeColor.TRANSPARENT);
    },
    [canvasRef, palette, setSpriteDataCoordinates]
  );

  const handlePointerMove = useCallback(
    (coordinates: Coordinates) => {
      if (!canvasRef.current) return;

      drawPixelOnCanvas(
        canvasRef.current,
        coordinates,
        MakeCodeColor.TRANSPARENT,
        palette
      );

      setSpriteDataCoordinates(coordinates, MakeCodeColor.TRANSPARENT);
    },
    [canvasRef, palette, setSpriteDataCoordinates]
  );

  const handlePointerUp = useCallback(() => {
    commitSpriteData();
  }, [commitSpriteData]);

  return { handlePointerDown, handlePointerMove, handlePointerUp };
};
