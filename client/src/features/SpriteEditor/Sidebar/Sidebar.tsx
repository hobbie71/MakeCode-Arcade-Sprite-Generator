// Context imports
import { ColorOrder } from "@/types/color";

// Component imports
import ColorIcon from "./components/ColorIcon/ColorIcon";
import StrokeIcon from "./components/StrokeIcon/StrokeIcon";
import SelectedColorIcons from "./components/SelectedColorIcons/SelectedColorIcons";
import ToolIcon from "./components/ToolIcon/ToolIcon";
import ZoomIcons from "./components/ZoomIcons/ZoomIcons";

// Type imports
import { EditorTools } from "@/types/tools";

const TOOL_ICONS: Array<{ tool: EditorTools; icon: string }> = [
  { tool: EditorTools.Pencil, icon: "PencilReply" },
  { tool: EditorTools.Eraser, icon: "EraseTool" },
  { tool: EditorTools.Rectangle, icon: "RectangleShape" },
  { tool: EditorTools.Fill, icon: "BucketColor" },
  { tool: EditorTools.Circle, icon: "CircleRing" },
  { tool: EditorTools.Line, icon: "Line" },
  { tool: EditorTools.Select, icon: "SelectAll" },
  { tool: EditorTools.Pan, icon: "HandsFree" },
];

const STROKE_SIZES = [1, 3, 5];

const SideBar = () => {
  return (
    <div className="p-1 max-w-20" style={{ backgroundColor: "#333333" }}>
      <div className="stroke-icon-container flex flex-row justify-around items-center px-1">
        {STROKE_SIZES.map((size, i) => (
          <StrokeIcon key={i} strokeSize={size} />
        ))}
      </div>
      <div className="tool-icon-container flex flex-row flex-wrap justify-around my-3 gap-1 gap-y-3">
        {TOOL_ICONS.map(({ tool, icon }, i) => (
          <ToolIcon key={i} tool={tool} icon={icon} />
        ))}
      </div>
      <div className="color-selected-container my-3 px-1">
        <SelectedColorIcons />
      </div>
      <div className="color-icon-container flex flex-row flex-wrap justify-center">
        {ColorOrder.map((color, i) => (
          <ColorIcon key={i} color={color} />
        ))}
      </div>
      <div className="zoom-icon-container flex flex-row flex-wrap justify-around my-3">
        <ZoomIcons />
      </div>
    </div>
  );
};

export default SideBar;
