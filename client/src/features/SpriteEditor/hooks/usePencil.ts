import { useCallback } from "react";

// Context imports

import { useCanvas } from "../contexts/CanvasContext/useCanvas";
import { useColorSelected } from "../contexts/ColorSelectedContext/useColorSelected";

// Hook imports
import { useSpriteData } from "./useSpriteData";

// Lib imports
import { handleDraw } from "../libs/handleDraw";

// Type imports
import { Coordinates } from "@/types/pixel";
import { EditorTools } from "@/types";

export const usePencil = () => {
  const { canvasRef } = useCanvas();
  const { color, palette } = useColorSelected();
  const { setSpriteDataCoordinates, commitSpriteData } = useSpriteData();

  const handlePointerDown = useCallback(
    (coordinates: Coordinates) => {
      if (!canvasRef.current) return;

      const colorDrawn = handleDraw(
        canvasRef.current,
        coordinates,
        color,
        palette,
        EditorTools.Pencil
      );

      setSpriteDataCoordinates(coordinates, colorDrawn);
    },
    [canvasRef, color, palette, setSpriteDataCoordinates]
  );

  const handlePointerMove = useCallback(
    (coordinates: Coordinates) => {
      if (!canvasRef.current) return;

      const colorDrawn = handleDraw(
        canvasRef.current,
        coordinates,
        color,
        palette,
        EditorTools.Pencil
      );

      setSpriteDataCoordinates(coordinates, colorDrawn);
    },
    [canvasRef, color, palette, setSpriteDataCoordinates]
  );

  const handlePointerUp = useCallback(() => {
    commitSpriteData();
  }, [commitSpriteData]);

  return { handlePointerDown, handlePointerMove, handlePointerUp };
};
