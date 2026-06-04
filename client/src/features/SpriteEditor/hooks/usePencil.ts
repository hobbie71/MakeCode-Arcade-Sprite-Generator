import { useCallback, useRef } from "react";

// Context imports
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useColorSelected } from "../contexts/ColorSelectedContext/useColorSelected";
import { useStrokeSize } from "../contexts/StrokeSizeContext/useStrokeSize";
import { useHistory } from "../contexts/HistoryContext/useHistory";
import { usePixelPerfect } from "../contexts/PixelPerfectContext/usePixelPerfect";

// Hook imports
import { useSpriteData } from "./useSpriteData";

// Lib imports
import { drawPixelsOnCanvas } from "../libs/drawPixelOnCanvas";
import { getLineCoordinates } from "../libs/getShapeCoordinates";

// Utils imports
import { getStrokeCoordinates } from "../utils/getStrokeCoordinates";

// Type imports
import type { Coordinates } from "../../../types/pixel";
import { MakeCodeColor } from "../../../types/color";
import { PIXEL_SIZE } from "../constants/canvas";

export const usePencil = () => {
  const { canvasRef } = useCanvas();
  const { color } = useColorSelected();
  const { palette } = usePaletteSelected();
  const { setSpriteDataCoordinates, commitSpriteData, getCurrentSpriteData } =
    useSpriteData();
  const { strokeSize } = useStrokeSize();
  const { pushSnapshot } = useHistory();
  const { pixelPerfect } = usePixelPerfect();

  const previousCoordinates = useRef<Coordinates | null>(null);

  // Pixel-perfect bookkeeping (only used when pixelPerfect && strokeSize === 1).
  const strokePathRef = useRef<Coordinates[]>([]);
  const originalDataRef = useRef<MakeCodeColor[][] | null>(null);

  // True only when pixel-perfect should actually run for this stroke.
  const ppActive = useCallback(
    () => pixelPerfect && strokeSize === 1,
    [pixelPerfect, strokeSize]
  );

  // After appending a pixel to the path, drop an L-shaped corner: if the last
  // three points a-b-c turn a diagonal corner (a & c diagonally adjacent, b the
  // orthogonal cell between them), repaint b with the color that was under it.
  const removeCornerIfNeeded = useCallback(() => {
    const path = strokePathRef.current;
    if (path.length < 3) return;

    const a = path[path.length - 3];
    const b = path[path.length - 2];
    const c = path[path.length - 1];

    const diagonal =
      Math.abs(a.x - c.x) === 1 && Math.abs(a.y - c.y) === 1;
    const bIsCorner =
      (b.x === a.x || b.x === c.x) && (b.y === a.y || b.y === c.y);
    const bDistinct = !(b.x === a.x && b.y === a.y) && !(b.x === c.x && b.y === c.y);

    if (!diagonal || !bIsCorner || !bDistinct) return;
    if (!canvasRef.current || !originalDataRef.current) return;

    const original =
      originalDataRef.current[b.y]?.[b.x] ?? MakeCodeColor.TRANSPARENT;

    drawPixelsOnCanvas(canvasRef.current, [b], original, palette, PIXEL_SIZE, 1);
    setSpriteDataCoordinates(b, original);

    // Drop b from the path so the corrected line is a -> c.
    path.splice(path.length - 2, 1);
  }, [canvasRef, palette, setSpriteDataCoordinates]);

  const pushPathPixel = useCallback(
    (coord: Coordinates) => {
      const path = strokePathRef.current;
      const last = path[path.length - 1];
      if (last && last.x === coord.x && last.y === coord.y) return;
      path.push(coord);
      removeCornerIfNeeded();
    },
    [removeCornerIfNeeded]
  );

  const handlePointerDown = useCallback(
    (coordinates: Coordinates) => {
      if (!canvasRef.current) return;

      if (ppActive()) {
        // Snapshot the canvas state so removed corners restore correctly.
        originalDataRef.current = getCurrentSpriteData().map((row) => [...row]);
        strokePathRef.current = [];
      }

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

      if (ppActive()) pushPathPixel(coordinates);

      // Store the current position as the previous position
      previousCoordinates.current = coordinates;
    },
    [
      canvasRef,
      color,
      palette,
      setSpriteDataCoordinates,
      strokeSize,
      ppActive,
      getCurrentSpriteData,
      pushPathPixel,
    ]
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

        // Pixel-perfect runs on the interpolated path, in order, skipping the
        // first point (already in the path from the previous move/down).
        if (ppActive()) {
          for (let i = 1; i < lineCoordinates.length; i++) {
            pushPathPixel(lineCoordinates[i]);
          }
        }
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

        if (ppActive()) pushPathPixel(coordinates);
      }

      // Update previous position
      previousCoordinates.current = coordinates;
    },
    [
      canvasRef,
      color,
      palette,
      setSpriteDataCoordinates,
      strokeSize,
      ppActive,
      pushPathPixel,
    ]
  );

  const handlePointerUp = useCallback(() => {
    commitSpriteData();
    pushSnapshot(getCurrentSpriteData());
    // Reset stroke state for next drawing session
    previousCoordinates.current = null;
    strokePathRef.current = [];
    originalDataRef.current = null;
  }, [commitSpriteData, pushSnapshot, getCurrentSpriteData]);

  return { handlePointerDown, handlePointerMove, handlePointerUp };
};
