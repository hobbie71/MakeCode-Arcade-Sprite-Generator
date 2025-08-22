import { Coordinates } from "@/types/pixel";
import { MakeCodeColor, MakeCodePalette } from "@/types/color";

import { getHexFromColor } from "@/utils/getHexFromColor";

import { PIXEL_SIZE } from "../constants/pixelSize";

export function drawPixelOnCanvas(
  canvas: HTMLCanvasElement,
  position: Coordinates,
  color: MakeCodeColor,
  palette?: MakeCodePalette,
  pixelSize: number = PIXEL_SIZE
): void {
  if (color === MakeCodeColor.TRANSPARENT) {
    drawCheckerboard(canvas, position, pixelSize);
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const hexColor = getHexFromColor(color, palette);

  ctx.fillStyle = hexColor;
  ctx.fillRect(
    position.x * pixelSize,
    position.y * pixelSize,
    pixelSize,
    pixelSize
  );
}

export function drawPixelOnCanvasTransparent(
  canvas: HTMLCanvasElement,
  position: Coordinates,
  color: MakeCodeColor,
  palette?: MakeCodePalette,
  pixelSize: number = PIXEL_SIZE
): void {
  if (color === MakeCodeColor.TRANSPARENT) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const hexColor = getHexFromColor(color, palette);

  ctx.fillStyle = hexColor;
  ctx.fillRect(
    position.x * pixelSize,
    position.y * pixelSize,
    pixelSize,
    pixelSize
  );
}

export function drawSpriteDataOnCanvas(
  canvas: HTMLCanvasElement,
  startPosition: Coordinates,
  spriteData: MakeCodeColor[][],
  palette?: MakeCodePalette,
  pixelSize: number = PIXEL_SIZE
) {
  for (let y = 0; y < spriteData.length; y++) {
    for (let x = 0; x < spriteData[y].length; x++) {
      drawPixelOnCanvas(
        canvas,
        { x: startPosition.x + x, y: startPosition.y + y },
        spriteData[y][x],
        palette,
        pixelSize
      );
    }
  }
}

function drawCheckerboard(
  canvas: HTMLCanvasElement,
  position: Coordinates,
  pixelSize: number,
  colorA = "#aeaeae",
  colorB = "#dedede"
) {
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
}
