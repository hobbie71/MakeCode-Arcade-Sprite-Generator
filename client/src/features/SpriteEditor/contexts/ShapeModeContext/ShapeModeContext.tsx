import { createStateContext } from "../../../../context/createStateContext";

export type ShapeMode = "outline" | "fill";

/** Whether Rectangle/Circle draw a filled shape or just the outline. */
const { Context: ShapeModeContext, Provider: ShapeModeProvider } =
  createStateContext<ShapeMode>("outline");

export { ShapeModeContext, ShapeModeProvider };
