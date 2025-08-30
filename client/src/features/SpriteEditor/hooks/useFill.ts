import { useCallback } from "react";

// Context imports
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";
import { useColorSelected } from "../contexts/ColorSelectedContext/useColorSelected";
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";

// Hook imports
import { useSpriteData } from "./useSpriteData";

// Lib imports
import { drawPixelOnCanvas } from "../libs/drawPixelOnCanvas";

// Type imports
import type { Coordinates } from "../../../types/pixel";
import { MakeCodeColor } from "../../../types/color";

export const useFill = () => {
  const { canvasRef } = useCanvas();
  const { color } = useColorSelected();
  const { palette } = usePaletteSelected();
  const { width, height } = useCanvasSize();
  const { getCurrentSpriteData, setSpriteDataCoordinates, commitSpriteData } =
    useSpriteData();

  const floodFill = useCallback(
    (
      startCoordinates: Coordinates,
      targetColor: MakeCodeColor,
      replacementColor: MakeCodeColor
    ) => {
      if (!canvasRef.current) return;

      // Don't fill if target and replacement colors are the same
      if (targetColor === replacementColor) return;

      const spriteData = getCurrentSpriteData();
      const stack: Coordinates[] = [startCoordinates];
      const visited = new Set<string>();

      while (stack.length > 0) {
        const current = stack.pop()!;
        const key = `${current.x},${current.y}`;

        // Skip if already visited or out of bounds
        if (
          visited.has(key) ||
          current.x < 0 ||
          current.x >= width ||
          current.y < 0 ||
          current.y >= height
        ) {
          continue;
        }

        // Skip if current pixel is not the target color
        if (spriteData[current.y][current.x] !== targetColor) {
          continue;
        }

        // Mark as visited
        visited.add(key);

        // Fill the current pixel
        drawPixelOnCanvas(
          canvasRef.current,
          current,
          replacementColor,
          palette
        );
        setSpriteDataCoordinates(current, replacementColor);

        // Add neighboring pixels to stack
        stack.push(
          { x: current.x + 1, y: current.y }, // Right
          { x: current.x - 1, y: current.y }, // Left
          { x: current.x, y: current.y + 1 }, // Down
          { x: current.x, y: current.y - 1 } // Up
        );
      }
    },
    [
      canvasRef,
      palette,
      width,
      height,
      getCurrentSpriteData,
      setSpriteDataCoordinates,
    ]
  );

  const handlePointerDown = useCallback(
    (coordinates: Coordinates) => {
      if (!canvasRef.current) return;

      const spriteData = getCurrentSpriteData();

      // Check bounds
      if (
        coordinates.x < 0 ||
        coordinates.x >= width ||
        coordinates.y < 0 ||
        coordinates.y >= height
      ) {
        return;
      }

      const targetColor = spriteData[coordinates.y][coordinates.x];

      // Perform flood fill
      floodFill(coordinates, targetColor, color);

      // Commit the changes
      commitSpriteData();
    },
    [
      canvasRef,
      width,
      height,
      getCurrentSpriteData,
      floodFill,
      color,
      commitSpriteData,
    ]
  );

  return { handlePointerDown };
};
