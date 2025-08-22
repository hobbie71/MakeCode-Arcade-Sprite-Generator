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
import { MakeCodeColor } from "@/types";

export const useEraser = () => {
  const { canvasRef } = useCanvas();
  const { setSpriteDataCoordinates, commitSpriteData } = useSpriteData();
  const { palette } = useColorSelected();

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
