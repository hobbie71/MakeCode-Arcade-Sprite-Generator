import { useCallback } from "react";

// Context imports
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { useColorSelected } from "../contexts/ColorSelectedContext/useColorSelected";

// Hook imports
import { useSpriteData } from "./useSpriteData";

// Type imports
import type { Coordinates } from "../../../types/pixel";

/**
 * Eyedropper / color picker. A single click reads the palette color of the
 * pixel under the cursor and makes it the active drawing color (transparent
 * included — it's a selectable swatch). Like Fill, this is a one-shot
 * pointer-down gesture: it never paints, so there's no move/up phase and no
 * history snapshot.
 */
export const useEyedropper = () => {
  const { canvasRef } = useCanvas();
  const { width, height } = useCanvasSize();
  const { getCurrentSpriteData } = useSpriteData();
  const { setColor } = useColorSelected();

  const handlePointerDown = useCallback(
    (coordinates: Coordinates) => {
      if (!canvasRef.current) return;

      const { x, y } = coordinates;
      if (x < 0 || x >= width || y < 0 || y >= height) return;

      const pickedColor = getCurrentSpriteData()[y]?.[x];
      if (pickedColor === undefined) return;

      setColor(pickedColor);
    },
    [canvasRef, width, height, getCurrentSpriteData, setColor]
  );

  return { handlePointerDown };
};
