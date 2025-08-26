import { useEffect, useRef } from "react";

// Context imports
import { useCanvasSize } from "@/context/CanvasSizeContext/useCanvasSize";

// Hook imports
import { useSpriteData } from "../hooks/useSpriteData";

// Lib imports
import { getResizedSpriteData } from "@/libs/getResizedSpriteData";

/**
 * Component that handles sprite data resizing when canvas dimensions change.
 * This is separated from the canvas size updates to prevent circular dependencies.
 */
const SpriteDataResizer = () => {
  const { width, height } = useCanvasSize();
  const { getCurrentSpriteData, resizeSpriteData } = useSpriteData();
  const previousSizeRef = useRef({ width: 16, height: 16 });

  useEffect(() => {
    const hasCanvasSizeChanged =
      previousSizeRef.current.width !== width ||
      previousSizeRef.current.height !== height;

    if (hasCanvasSizeChanged) {
      // Get current sprite data and resize it
      const currentData = getCurrentSpriteData();
      const resizedData = getResizedSpriteData(currentData, width, height);

      // Update the resized data
      resizeSpriteData(resizedData);

      // Update the ref
      previousSizeRef.current = { width, height };
    }
  }, [width, height, getCurrentSpriteData, resizeSpriteData]);

  return null; // This component doesn't render anything
};

export default SpriteDataResizer;
