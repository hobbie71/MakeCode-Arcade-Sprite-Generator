import type { Coordinates, StrokeSize } from "../../../types/pixel";
import { MakeCodeColor } from "../../../types/color";
import type { MakeCodePalette } from "../../../types/color";

import { getHexFromMakeCodeColor } from "../../../utils/colors/getColorFromMakeCodeColor";
import { getStrokeCoordinates } from "../utils/getStrokeCoordinates";

import { PIXEL_SIZE } from "../constants/canvas";

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

/**
 * Draw subtle 1px grid lines between every sprite pixel, on top of the
 * already-rendered pixels. A translucent dark line (the in-canvas transparency
 * checkerboard is always a light gray, so this reads clearly in both themes
 * without being harsh; over solid drawn pixels it all but disappears, as a
 * pixel-editor grid should).
 */
export const drawGrid = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  pixelSize: number = PIXEL_SIZE
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.save();
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 1;

  // Crisp 1px lines: offset by 0.5 so the stroke lands on a device pixel.
  for (let x = 0; x <= width; x++) {
    const px = Math.round(x * pixelSize) + 0.5;
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, height * pixelSize);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y++) {
    const py = Math.round(y * pixelSize) + 0.5;
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(width * pixelSize, py);
    ctx.stroke();
  }

  ctx.restore();
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
