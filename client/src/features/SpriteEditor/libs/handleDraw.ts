// Lib imports
import { drawPixelOnCanvas } from "./drawPixelOnCanvas";

// Type imports
import { Coordinates } from "@/types/pixel";
import { MakeCodeColor, MakeCodePalette } from "@/types/color";
import { EditorTools } from "@/types/tools";

// TODO: add advance tools, circle, rectangle, fill, and line

export function handleDraw(
  canvas: HTMLCanvasElement,
  coordinates: Coordinates,
  color: MakeCodeColor,
  palette: MakeCodePalette,
  tool: EditorTools
) {
  switch (tool) {
    case EditorTools.Pencil:
      drawPixelOnCanvas(canvas, coordinates, color, palette);
      break;
    case EditorTools.Eraser:
      drawPixelOnCanvas(
        canvas,
        coordinates,
        MakeCodeColor.TRANSPARENT,
        palette
      );
      break;
    case EditorTools.Circle:
      break;
    case EditorTools.Fill:
      break;
    case EditorTools.Line:
      break;
    case EditorTools.Rectangle:
      break;
  }
}
