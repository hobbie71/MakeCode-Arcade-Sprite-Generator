import { useCallback } from "react";

// Context imports
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";
import { useColorSelected } from "../contexts/ColorSelectedContext/useColorSelected";
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { useHistory } from "../contexts/HistoryContext/useHistory";
import { useFillOptions } from "../contexts/FillOptionsContext/useFillOptions";

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
  const { pushSnapshot } = useHistory();
  const { tolerance } = useFillOptions();

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

      const paint = (x: number, y: number) => {
        drawPixelOnCanvas(canvasRef.current!, { x, y }, replacementColor, palette);
        setSpriteDataCoordinates({ x, y }, replacementColor);
      };

      // Tolerance 100 = global: replace every matching pixel on the canvas,
      // ignoring contiguity.
      if (tolerance >= 100) {
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            if (spriteData[y][x] === targetColor) paint(x, y);
          }
        }
        return;
      }

      // Otherwise a contiguous flood: 4-connected at tolerance 0, 8-connected
      // (bridges diagonal gaps) for any tolerance above 0.
      const eightWay = tolerance > 0;
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
        paint(current.x, current.y);

        // Add orthogonal neighbors
        stack.push(
          { x: current.x + 1, y: current.y }, // Right
          { x: current.x - 1, y: current.y }, // Left
          { x: current.x, y: current.y + 1 }, // Down
          { x: current.x, y: current.y - 1 } // Up
        );

        // ...and diagonals when tolerance lets the fill bridge gaps
        if (eightWay) {
          stack.push(
            { x: current.x + 1, y: current.y + 1 },
            { x: current.x - 1, y: current.y + 1 },
            { x: current.x + 1, y: current.y - 1 },
            { x: current.x - 1, y: current.y - 1 }
          );
        }
      }
    },
    [
      canvasRef,
      palette,
      width,
      height,
      getCurrentSpriteData,
      setSpriteDataCoordinates,
      tolerance,
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
      pushSnapshot(getCurrentSpriteData());
    },
    [
      canvasRef,
      width,
      height,
      getCurrentSpriteData,
      floodFill,
      color,
      commitSpriteData,
      pushSnapshot,
    ]
  );

  return { handlePointerDown };
};
