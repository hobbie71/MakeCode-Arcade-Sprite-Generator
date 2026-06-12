import { useCallback, useRef } from "react";

// Hook imports
import { useCanvasPreview } from "./useCanvasPreview";
import { useSpriteData } from "./useSpriteData";

// Lib imports
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

type GetShapeCoordinates = (
  start: Coordinates,
  end: Coordinates
) => Coordinates[];

interface ShapeToolConfig {
  previewKey: "drawLinePreview" | "drawSquarePreview" | "drawCirclePreview";
  getOutlineCoordinates: GetShapeCoordinates;
  // When omitted, the tool ignores shape mode (e.g. the line tool)
  getFilledCoordinates?: GetShapeCoordinates;
}

export const useShapeTool = ({
  previewKey,
  getOutlineCoordinates,
  getFilledCoordinates,
}: ShapeToolConfig) => {
  const { canvasRef } = useCanvas();
  const { color } = useColorSelected();
  const { palette } = usePaletteSelected();
  const canvasPreview = useCanvasPreview();
  const { drawDotPreview } = canvasPreview;
  const drawShapePreview = canvasPreview[previewKey];
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

      drawShapePreview(startCoordinates.current, end);
    },
    [drawShapePreview]
  );

  const handlePointerUp = useCallback(
    (end: Coordinates) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (!startCoordinates.current) return;

      const getCoordinates =
        shapeMode === "fill" && getFilledCoordinates
          ? getFilledCoordinates
          : getOutlineCoordinates;
      const coordinates = getCoordinates(startCoordinates.current, end);
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
      getOutlineCoordinates,
      getFilledCoordinates,
      pushSnapshot,
      getCurrentSpriteData,
    ]
  );

  return { handlePointerDown, handlePointerMove, handlePointerUp };
};
