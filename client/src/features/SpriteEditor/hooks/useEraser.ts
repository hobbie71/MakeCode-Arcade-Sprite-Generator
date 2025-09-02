import { useCallback } from "react";

// Context imports
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";

// Hook imports
import { useSpriteData } from "./useSpriteData";

// Lib imports
import { handleDraw } from "../libs/handleDraw";

// Type imports
import type { Coordinates } from "../../../types/pixel";
import { EditorTools } from "../../../types/tools";
import { MakeCodeColor } from "../../../types/color";

export const useEraser = () => {
  const { canvasRef } = useCanvas();
  const { setSpriteDataCoordinates, commitSpriteData } = useSpriteData();
  const { palette } = usePaletteSelected();

  const handlePointerDown = useCallback(
    (coordinates: Coordinates) => {
      if (!canvasRef.current) return;

      const colorDrawn = handleDraw(
        canvasRef.current,
        coordinates,
        MakeCodeColor.TRANSPARENT,
        palette,
        EditorTools.Pencil
      );

      setSpriteDataCoordinates(coordinates, colorDrawn);
    },
    [canvasRef, palette, setSpriteDataCoordinates]
  );

  const handlePointerMove = useCallback(
    (coordinates: Coordinates) => {
      if (!canvasRef.current) return;

      handleDraw(
        canvasRef.current,
        coordinates,
        MakeCodeColor.TRANSPARENT,
        palette,
        EditorTools.Pencil
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
