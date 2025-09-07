import { useCallback, useRef } from "react";

// Hook imports
import { useCanvasPreview } from "./useCanvasPreview";
import { useSpriteData } from "./useSpriteData";

// Lib imports
import { getLineCoordinates } from "../libs/getShapeCoordinates";
import { drawPixelsOnCanvas } from "../libs/drawPixelOnCanvas";

// Context imports
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useColorSelected } from "../contexts/ColorSelectedContext/useColorSelected";
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";

// Type imports
import type { Coordinates } from "../../../types/pixel";

export const useLine = () => {
  const { canvasRef } = useCanvas();
  const { color } = useColorSelected();
  const { palette } = usePaletteSelected();
  const { drawLinePreview, drawDotPreview } = useCanvasPreview();
  const { setSpriteDataCoordinates, commitSpriteData } = useSpriteData();

  const startCoordinates = useRef<Coordinates | null>(null);

  const handlePointerDown = useCallback(
    (start: Coordinates) => {
      startCoordinates.current = start;
      drawDotPreview(start);
    },
    [drawDotPreview]
  );

  const handlePointerMove = useCallback(
    (end: Coordinates) => {
      if (!startCoordinates.current) return;

      drawLinePreview(startCoordinates.current, end);
    },
    [drawLinePreview]
  );

  const handlePointerUp = useCallback(
    (end: Coordinates) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (!startCoordinates.current) return;

      const coordinates = getLineCoordinates(startCoordinates.current, end);
      drawPixelsOnCanvas(canvas, coordinates, color, palette);

      setSpriteDataCoordinates(coordinates, color);
      commitSpriteData();
    },
    [canvasRef, color, palette, setSpriteDataCoordinates, commitSpriteData]
  );
  return { handlePointerDown, handlePointerMove, handlePointerUp };
};
