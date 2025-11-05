export enum EditorTools {
  Pencil = "pencil",
  Eraser = "eraser",
  Fill = "fill",
  Line = "line",
  Rectangle = "rectangle",
  Circle = "circle",
  Select = "select",
  Pan = "pan",
}

export type EditorToolType =
  | "pencil"
  | "eraser"
  | "fill"
  | "line"
  | "rectangle"
  | "circle"
  | "select"
  | "pan";

export const ALL_EDITOR_TOOLS: Array<{
  tool: EditorTools;
  icon: string;
  name: string;
  shortcut: string;
}> = [
  {
    tool: EditorTools.Pencil,
    icon: "PencilReply",
    name: "Pencil",
    shortcut: "P",
  },
  {
    tool: EditorTools.Eraser,
    icon: "EraseTool",
    name: "Eraser",
    shortcut: "E",
  },
  {
    tool: EditorTools.Rectangle,
    icon: "RectangleShape",
    name: "Rectangle",
    shortcut: "R",
  },
  { tool: EditorTools.Fill, icon: "BucketColor", name: "Fill", shortcut: "F" },
  {
    tool: EditorTools.Circle,
    icon: "CircleRing",
    name: "Circle",
    shortcut: "C",
  },
  { tool: EditorTools.Line, icon: "Line", name: "Line", shortcut: "L" },
  {
    tool: EditorTools.Select,
    icon: "SelectAll",
    name: "Select",
    shortcut: "S",
  },
  { tool: EditorTools.Pan, icon: "HandsFree", name: "Pan", shortcut: "H" },
];

export function getEditorToolInfo(tool: EditorTools) {
  return ALL_EDITOR_TOOLS.find((t) => t.tool === tool);
}
