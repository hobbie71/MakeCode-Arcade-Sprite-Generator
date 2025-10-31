import { memo, useState, useId, useRef } from "react";
import { useToolSelected } from "../../../../features/SpriteEditor/contexts/ToolSelectedContext/useToolSelected";
import { EditorTools, TOOL_ICONS } from "../../../../types/tools";

interface Props {
  tool: EditorTools;
  icon: string;
}

const ToolIcon = memo(({ tool, icon }: Props) => {
  const { tool: selectedTool, setTool } = useToolSelected();
  const isSelected = tool === selectedTool;
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipId = useId();
  const buttonId = useId();
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get tool info from TOOL_ICONS
  const toolInfo = TOOL_ICONS.find((t) => t.tool === tool);
  const toolName = toolInfo?.name || tool;
  const shortcut = toolInfo?.shortcut || "";

  const handleMouseDown = () => {
    setTool(tool);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        setTool(tool);
        break;
      default:
        break;
    }
  };

  const handleMouseEnter = () => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // Show tooltip after 500ms delay
    hoverTimeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    // Clear timeout and hide tooltip
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowTooltip(false);
  };

  return (
    <div className="relative inline-block">
      <button
        id={buttonId}
        className={`tool-button ${isSelected ? "active" : ""}`}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={`${toolName}${shortcut ? `, shortcut: ${shortcut}` : ""}`}
        aria-pressed={isSelected}
        aria-describedby={showTooltip ? tooltipId : undefined}
        role="button"
        type="button"
        tabIndex={0}>
        <i className={`ms-Icon ms-Icon--${icon}`} aria-hidden="true" />
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute top-full translate-x-8 mt-1 z-50
                     px-1.5 py-0.5 text-[10px] font-normal text-text-default-300 bg-default-200 
                     shadow-default-lg rounded pointer-events-none"
          aria-hidden="false">
          <span>{toolName}</span>
          {shortcut && <span className="ml-1 opacity-75">({shortcut})</span>}
        </div>
      )}
    </div>
  );
});

export default ToolIcon;
