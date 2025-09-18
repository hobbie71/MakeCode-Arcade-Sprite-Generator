import type { Coordinates, StrokeSize } from "../../../types/pixel";
import { MakeCodeColor } from "../../../types/color";
import type { MakeCodePalette } from "../../../types/color";

import { getHexFromMakeCodeColor } from "../../../utils/colors/getColorFromMakeCodeColor";

import { PIXEL_SIZE } from "../constants/canvas";

/**
 * Get all pixel coordinates that should be affected by a stroke of given size
 * @param center - The center position of the stroke
 * @param strokeSize - The size of the stroke (1, 3, or 5)
 * @returns Array of coordinates that should be painted
 */
const getStrokeCoordinates = (
  center: Coordinates,
  strokeSize: StrokeSize
): Coordinates[] => {
  const coordinates: Coordinates[] = [];
  const radius = Math.floor(strokeSize / 2);

  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      coordinates.push({
        x: center.x + dx,
        y: center.y + dy,
      });
    }
  }

  return coordinates;
};

export const drawPixelOnCanvas = (
  canvas: HTMLCanvasElement,
  position: Coordinates,
  color: MakeCodeColor,
  palette: MakeCodePalette,
  pixelSize: number = PIXEL_SIZE,
  strokeSize: StrokeSize = 1
) => {
  const strokePositions = getStrokeCoordinates(position, strokeSize);

  strokePositions.forEach((strokePosition) => {
    if (color === MakeCodeColor.TRANSPARENT) {
      drawCheckerboard(canvas, strokePosition, pixelSize);
    } else {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const hexColor = getHexFromMakeCodeColor(color, palette);

      ctx.fillStyle = hexColor;
      ctx.fillRect(
        strokePosition.x * pixelSize,
        strokePosition.y * pixelSize,
        pixelSize,
        pixelSize
      );
    }
  });
};

export const drawPixelOnCanvasTransparent = (
  canvas: HTMLCanvasElement,
  position: Coordinates,
  color: MakeCodeColor,
  palette: MakeCodePalette,
  pixelSize: number = PIXEL_SIZE,
  strokeSize: StrokeSize = 1
): void => {
  if (color === MakeCodeColor.TRANSPARENT) return;

  const strokePositions = getStrokeCoordinates(position, strokeSize);

  strokePositions.forEach((strokePosition) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const hexColor = getHexFromMakeCodeColor(color, palette);

    ctx.fillStyle = hexColor;
    ctx.fillRect(
      strokePosition.x * pixelSize,
      strokePosition.y * pixelSize,
      pixelSize,
      pixelSize
    );
  });
};

export const drawSpriteDataOnCanvas = (
  canvas: HTMLCanvasElement,
  startPosition: Coordinates,
  spriteData: MakeCodeColor[][],
  palette: MakeCodePalette,
  pixelSize: number = PIXEL_SIZE,
  strokeSize: StrokeSize = 1
) => {
  for (let y = 0; y < spriteData.length; y++) {
    for (let x = 0; x < spriteData[y].length; x++) {
      drawPixelOnCanvas(
        canvas,
        { x: startPosition.x + x, y: startPosition.y + y },
        spriteData[y][x],
        palette,
        pixelSize,
        strokeSize
      );
    }
  }
};

export const drawSpriteDataOnCanvasTransparent = (
  canvas: HTMLCanvasElement,
  startPosition: Coordinates,
  spriteData: MakeCodeColor[][],
  palette: MakeCodePalette,
  pixelSize: number = PIXEL_SIZE,
  strokeSize: StrokeSize = 1
) => {
  for (let y = 0; y < spriteData.length; y++) {
    for (let x = 0; x < spriteData[y].length; x++) {
      drawPixelOnCanvasTransparent(
        canvas,
        { x: startPosition.x + x, y: startPosition.y + y },
        spriteData[y][x],
        palette,
        pixelSize,
        strokeSize
      );
    }
  }
};

export const drawPixelsOnCanvas = (
  canvas: HTMLCanvasElement,
  positions: Coordinates[],
  color: MakeCodeColor,
  palette: MakeCodePalette,
  pixelSize: number = PIXEL_SIZE,
  strokeSize: StrokeSize = 1
) => {
  positions.forEach((position) => {
    drawPixelOnCanvas(canvas, position, color, palette, pixelSize, strokeSize);
  });
};

const drawCheckerboard = (
  canvas: HTMLCanvasElement,
  position: Coordinates,
  pixelSize: number,
  colorA = "#aeaeae",
  colorB = "#dedede"
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const colors = [
    [colorA, colorB],
    [colorB, colorA],
  ];

  const half = pixelSize / 2;
  for (let dy = 0; dy < 2; dy++) {
    for (let dx = 0; dx < 2; dx++) {
      ctx.fillStyle = colors[dy][dx];
      ctx.fillRect(
        position.x * pixelSize + dx * half,
        position.y * pixelSize + dy * half,
        half,
        half
      );
    }
  }
};
