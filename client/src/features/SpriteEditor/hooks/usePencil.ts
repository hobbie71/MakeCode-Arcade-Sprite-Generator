import { useCallback } from "react";

// Context imports
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useColorSelected } from "../contexts/ColorSelectedContext/useColorSelected";

// Hook imports
import { useSpriteData } from "./useSpriteData";

// Lib imports
import { drawPixelOnCanvas } from "../libs/drawPixelOnCanvas";

// Type imports
import type { Coordinates } from "../../../types/pixel";

export const usePencil = () => {
  const { canvasRef } = useCanvas();
  const { color } = useColorSelected();
  const { palette } = usePaletteSelected();
  const { setSpriteDataCoordinates, commitSpriteData } = useSpriteData();

  const handlePointerDown = useCallback(
    (coordinates: Coordinates) => {
      if (!canvasRef.current) return;

      drawPixelOnCanvas(canvasRef.current, coordinates, color, palette);

      setSpriteDataCoordinates(coordinates, color);
    },
    [canvasRef, color, palette, setSpriteDataCoordinates]
  );

  const handlePointerMove = useCallback(
    (coordinates: Coordinates) => {
      if (!canvasRef.current) return;

      drawPixelOnCanvas(canvasRef.current, coordinates, color, palette);

      setSpriteDataCoordinates(coordinates, color);
    },
    [canvasRef, color, palette, setSpriteDataCoordinates]
  );

  const handlePointerUp = useCallback(() => {
    commitSpriteData();
  }, [commitSpriteData]);

  return { handlePointerDown, handlePointerMove, handlePointerUp };
};
