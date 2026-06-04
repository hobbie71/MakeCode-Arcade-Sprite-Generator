import ToolIcons from "../Sidebar/components/ToolIcons";
import ZoomIcons from "../Sidebar/components/ZoomIcons";
import SelectedColorIcons from "../Sidebar/components/SelectedColorIcons";

/** Vertical tool rail: tools, zoom controls, and the current-color chip. */
export default function LeftRail() {
  return (
    <div className="flex w-14 shrink-0 flex-col items-center gap-1 border-r border-line bg-surface-raised py-2">
      <div className="flex flex-col items-center gap-1">
        <ToolIcons />
      </div>
      <span className="my-1 h-px w-8 bg-line" />
      <div className="flex flex-col items-center gap-1">
        <ZoomIcons />
      </div>
      <span className="my-1 h-px w-8 bg-line" />
      <div className="w-9">
        <SelectedColorIcons />
      </div>
    </div>
  );
}
