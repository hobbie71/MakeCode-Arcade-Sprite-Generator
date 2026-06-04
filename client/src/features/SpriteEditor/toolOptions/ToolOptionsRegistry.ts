import type { ComponentType } from "react";
import { EditorTools } from "../../../types/tools";
import StrokeSizeOption from "./StrokeSizeOption";
import ShapeModeOption from "./ShapeModeOption";
import FillToleranceOption from "./FillToleranceOption";
import PixelPerfectOption from "./PixelPerfectOption";

export type ToolOptionDescriptor = {
  id: string;
  Component: ComponentType;
};

/**
 * Which contextual options each tool exposes in the ToolOptionsStrip. Adding an
 * option to a tool is one line here + one option component. Tools not listed
 * (Select, Pan) show no options.
 */
export const TOOL_OPTIONS_REGISTRY: Partial<
  Record<EditorTools, ToolOptionDescriptor[]>
> = {
  [EditorTools.Pencil]: [
    { id: "stroke", Component: StrokeSizeOption },
    { id: "pixel-perfect", Component: PixelPerfectOption },
  ],
  [EditorTools.Eraser]: [{ id: "stroke", Component: StrokeSizeOption }],
  [EditorTools.Line]: [{ id: "stroke", Component: StrokeSizeOption }],
  [EditorTools.Rectangle]: [
    { id: "stroke", Component: StrokeSizeOption },
    { id: "shape", Component: ShapeModeOption },
  ],
  [EditorTools.Circle]: [
    { id: "stroke", Component: StrokeSizeOption },
    { id: "shape", Component: ShapeModeOption },
  ],
  [EditorTools.Fill]: [{ id: "tolerance", Component: FillToleranceOption }],
};
