import { useCallback, useRef } from "react";

// Hook imports
import { useCanvasPreview } from "./useCanvasPreview";
import { useSpriteData } from "./useSpriteData";

// Lib imports
import {
  getSquareCoordinates,
  getFilledSquareCoordinates,
} from "../libs/getShapeCoordinates";
import { drawPixelsOnCanvas } from "../libs/drawPixelOnCanvas";

// Utils imports
import { getStrokeCoordinates } from "../utils/getStrokeCoordinates";

// Context imports
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useColorSelected } from "../contexts/ColorSelectedContext/useColorSelected";
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";
import { useStrokeSize } from "../contexts/StrokeSizeContext/useStrokeSize";
import { useShapeMode } from "../contexts/ShapeModeContext/useShapeMode";
import { useHistory } from "../contexts/HistoryContext/useHistory";

// Type imports
import type { Coordinates } from "../../../types/pixel";
import { PIXEL_SIZE } from "../constants/canvas";

export const useRectangle = () => {
  const { canvasRef } = useCanvas();
  const { color } = useColorSelected();
  const { palette } = usePaletteSelected();
  const { drawSquarePreview, drawDotPreview } = useCanvasPreview();
  const { setSpriteDataCoordinates, commitSpriteData, getCurrentSpriteData } =
    useSpriteData();
  const { strokeSize } = useStrokeSize();
  const { shapeMode } = useShapeMode();
  const { pushSnapshot } = useHistory();

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

      drawSquarePreview(startCoordinates.current, end);
    },
    [drawSquarePreview]
  );

  const handlePointerUp = useCallback(
    (end: Coordinates) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (!startCoordinates.current) return;

      const coordinates =
        shapeMode === "fill"
          ? getFilledSquareCoordinates(startCoordinates.current, end)
          : getSquareCoordinates(startCoordinates.current, end);
      drawPixelsOnCanvas(
        canvas,
        coordinates,
        color,
        palette,
        PIXEL_SIZE,
        strokeSize
      );

      // Apply stroke size to each coordinate for sprite data
      const allStrokeCoordinates: Coordinates[] = [];
      coordinates.forEach((coord) => {
        const strokeCoords = getStrokeCoordinates(coord, strokeSize);
        allStrokeCoordinates.push(...strokeCoords);
      });

      setSpriteDataCoordinates(allStrokeCoordinates, color);
      commitSpriteData();
      pushSnapshot(getCurrentSpriteData());
    },
    [
      canvasRef,
      color,
      palette,
      setSpriteDataCoordinates,
      commitSpriteData,
      strokeSize,
      shapeMode,
      pushSnapshot,
      getCurrentSpriteData,
    ]
  );

  return { handlePointerDown, handlePointerMove, handlePointerUp };
};
