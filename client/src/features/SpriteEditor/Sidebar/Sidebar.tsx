// Component imports
import ColorIcons from "./components/ColorIcons";
import StrokeIcon from "./components/StrokeIcon";
import SelectedColorIcons from "./components/SelectedColorIcons";
import ToolIcon from "./components/ToolIcon";
import ZoomIcons from "./components/ZoomIcons";

// Type imports
import { EditorTools } from "../../../types/tools";
import { STROKE_SIZES } from "../../../types/pixel";

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

const SideBar = () => {
  return (
    <div className="toolbox bg-[#333333]">
      <div className="stroke-icon-container flex flex-row justify-around items-center my-2">
        {STROKE_SIZES.map((size, i) => (
          <StrokeIcon key={i} strokeSize={size} />
        ))}
      </div>
      <div className="tool-grid my-2 ">
        {TOOL_ICONS.map(({ tool, icon }, i) => (
          <ToolIcon key={i} tool={tool} icon={icon} />
        ))}
      </div>
      <div className="my-2">
        <SelectedColorIcons />
      </div>
      <ColorIcons />
      <div className="zoom-icon-container flex flex-row flex-wrap justify-around my-1">
        <ZoomIcons />
      </div>
    </div>
  );
};

export default SideBar;
