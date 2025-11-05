// Component imports
import ColorIcons from "./components/ColorIcons";
import StrokeIcon from "./components/StrokeIcon";
import SelectedColorIcons from "./components/SelectedColorIcons";
import ToolIcons from "./components/ToolIcons";
import ZoomIcons from "./components/ZoomIcons";

// Type imports
import { STROKE_SIZES } from "../../../types/pixel";

// Old toolback background color: bg-[#333333]

const SideBar = () => {
  return (
    <div className="toolbox">
      <div className="stroke-icon-container flex flex-row justify-around items-center my-2">
        {STROKE_SIZES.map((size, i) => (
          <StrokeIcon key={i} strokeSize={size} />
        ))}
      </div>
      <div className="tool-grid my-2 ">
        <ToolIcons />
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
