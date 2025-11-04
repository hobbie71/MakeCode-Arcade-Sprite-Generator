import { useCallback, useRef } from "react";

// Context imports
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useColorSelected } from "../contexts/ColorSelectedContext/useColorSelected";
import { useStrokeSize } from "../contexts/StrokeSizeContext/useStrokeSize";

// Hook imports
import { useSpriteData } from "./useSpriteData";

// Lib imports
import { drawPixelsOnCanvas } from "../libs/drawPixelOnCanvas";
import { getLineCoordinates } from "../libs/getShapeCoordinates";

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

  const previousCoordinates = useRef<Coordinates | null>(null);

  const handlePointerDown = useCallback(
    (coordinates: Coordinates) => {
      if (!canvasRef.current) return;

      // Draw the initial pixel
      drawPixelsOnCanvas(
        canvasRef.current,
        [coordinates],
        color,
        palette,
        PIXEL_SIZE,
        strokeSize
      );

      // Get all coordinates affected by stroke size for sprite data
      const strokeCoordinates = getStrokeCoordinates(coordinates, strokeSize);
      setSpriteDataCoordinates(strokeCoordinates, color);

      // Store the current position as the previous position
      previousCoordinates.current = coordinates;
    },
    [canvasRef, color, palette, setSpriteDataCoordinates, strokeSize]
  );

  const handlePointerMove = useCallback(
    (coordinates: Coordinates) => {
      if (!canvasRef.current) return;

      // If we have a previous position, draw a line from previous to current
      if (previousCoordinates.current) {
        const lineCoordinates = getLineCoordinates(
          previousCoordinates.current,
          coordinates
        );
        drawPixelsOnCanvas(
          canvasRef.current,
          lineCoordinates,
          color,
          palette,
          PIXEL_SIZE,
          strokeSize
        );

        // Apply stroke size to each coordinate for sprite data
        const allStrokeCoordinates: Coordinates[] = [];
        lineCoordinates.forEach((coord) => {
          const strokeCoords = getStrokeCoordinates(coord, strokeSize);
          allStrokeCoordinates.push(...strokeCoords);
        });

        setSpriteDataCoordinates(allStrokeCoordinates, color);
      } else {
        // Fallback: just draw the current pixel if no previous position
        drawPixelsOnCanvas(
          canvasRef.current,
          [coordinates],
          color,
          palette,
          PIXEL_SIZE,
          strokeSize
        );

        const strokeCoordinates = getStrokeCoordinates(coordinates, strokeSize);
        setSpriteDataCoordinates(strokeCoordinates, color);
      }

      // Update previous position
      previousCoordinates.current = coordinates;
    },
    [canvasRef, color, palette, setSpriteDataCoordinates, strokeSize]
  );

  const handlePointerUp = useCallback(() => {
    commitSpriteData();
    // Reset previous coordinates for next drawing session
    previousCoordinates.current = null;
  }, [commitSpriteData]);

  return { handlePointerDown, handlePointerMove, handlePointerUp };
};
