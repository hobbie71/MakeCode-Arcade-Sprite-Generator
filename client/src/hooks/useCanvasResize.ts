import { useCallback } from "react";

// Context imports
import { useCanvasSize } from "../context/CanvasSizeContext/useCanvasSize";

// Hook imports
import { useSpriteData } from "../features/SpriteEditor/hooks/useSpriteData";

// Lib imports
import { getResizedSpriteData } from "../libs/getResizedSpriteData";

export const useCanvasResize = () => {
  const { resizeSpriteData, getCurrentSpriteData } = useSpriteData();
  const { setWidth, setHeight } = useCanvasSize();

  const updateCanvasSize = useCallback(
    (newWidth: number, newHeight: number) => {
      // Get the current sprite data from ref (this should have the most up-to-date data)
      const currentData = getCurrentSpriteData();
      const resizedData = getResizedSpriteData(
        currentData,
        newWidth,
        newHeight
      );

      // Update both ref and state with resized data
      resizeSpriteData(resizedData);

      // Update canvas dimensions
      setWidth(newWidth);
      setHeight(newHeight);
    },
    [resizeSpriteData, getCurrentSpriteData, setWidth, setHeight]
  );

  return { updateCanvasSize };
};
