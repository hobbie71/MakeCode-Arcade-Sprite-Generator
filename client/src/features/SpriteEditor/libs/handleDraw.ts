// Lib imports
import { drawPixelOnCanvas } from "./drawPixelOnCanvas";

// Type imports
import type { Coordinates } from "../../../types/pixel";
import { MakeCodeColor } from "../../../types/color";
import type { MakeCodePalette } from "../../../types/color";
import { EditorTools } from "../../../types/tools";

// TODO: add advance tools, circle, rectangle, fill, and line

export function handleDraw(
  canvas: HTMLCanvasElement,
  coordinates: Coordinates,
  color: MakeCodeColor,
  palette: MakeCodePalette,
  tool: EditorTools
): MakeCodeColor {
  switch (tool) {
    case EditorTools.Pencil:
      drawPixelOnCanvas(canvas, coordinates, color, palette);
      return color;
    case EditorTools.Eraser:
      drawPixelOnCanvas(
        canvas,
        coordinates,
        MakeCodeColor.TRANSPARENT,
        palette
      );
      return MakeCodeColor.TRANSPARENT;
    case EditorTools.Circle:
    case EditorTools.Fill:
    case EditorTools.Line:
    case EditorTools.Rectangle:
      return color;
    default:
      return color;
  }
}
