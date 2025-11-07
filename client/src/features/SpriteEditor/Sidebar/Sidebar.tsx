// Component imports
import ColorIcons from "./components/ColorIcons";
import StrokeIcons from "./components/StrokeIcons";
import SelectedColorIcons from "./components/SelectedColorIcons";
import ToolIcons from "./components/ToolIcons";
import ZoomIcons from "./components/ZoomIcons";

// Old toolback background color: bg-[#333333]

const SideBar = () => {
  return (
    <div className="toolbox">
      <div className="stroke-icon-container flex flex-row justify-around items-center my-2">
        <StrokeIcons />
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
