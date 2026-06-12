import type { ComponentType } from "react";
import { EditorTools } from "../../../types/tools";
import StrokeSizeOption from "./StrokeSizeOption";
import ShapeModeOption from "./ShapeModeOption";
import FillModeOption from "./FillModeOption";
import PixelPerfectOption from "./PixelPerfectOption";
import SelectionActionsOption from "./SelectionActionsOption";
import SelectModeOption from "./SelectModeOption";
import WandContiguousOption from "./WandContiguousOption";

export type ToolOptionDescriptor = {
  id: string;
  Component: ComponentType;
};

/**
 * Which contextual options each tool exposes in the ToolOptionsStrip. Adding an
 * option to a tool is one line here + one option component. Pan shows no
 * options; Select's mode picker is added in a later phase.
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
  [EditorTools.Fill]: [{ id: "fill-mode", Component: FillModeOption }],
  [EditorTools.Select]: [
    { id: "select-mode", Component: SelectModeOption },
    { id: "wand-contiguous", Component: WandContiguousOption },
    { id: "selection-actions", Component: SelectionActionsOption },
  ],
};
