import ToolIcons from "../Sidebar/components/ToolIcons";
import ZoomIcons from "../Sidebar/components/ZoomIcons";
import GridToggleIcon from "../Sidebar/components/GridToggleIcon";
import SelectedColorIcons from "../Sidebar/components/SelectedColorIcons";

/** Vertical tool rail: tools, zoom controls, grid toggle, and the current-color chip. */
export default function LeftRail() {
  return (
    <div className="flex w-14 shrink-0 flex-col items-center gap-0.5 border-r border-line bg-surface-raised py-2">
      <div className="flex flex-col items-center gap-0.5">
        <ToolIcons />
      </div>
      <span className="my-1 h-px w-8 bg-line" />
      <div className="flex flex-col items-center gap-0.5">
        <ZoomIcons />
        <GridToggleIcon />
      </div>
      <span className="my-1 h-px w-8 bg-line" />
      <SelectedColorIcons />
    </div>
  );
}
