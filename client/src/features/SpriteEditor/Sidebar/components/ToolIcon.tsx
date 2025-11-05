import { memo } from "react";
import { useToolSelected } from "../../../../features/SpriteEditor/contexts/ToolSelectedContext/useToolSelected";
import { EditorTools, TOOL_ICONS } from "../../../../types/tools";
import Tooltip from "../../../../components/Tooltip";

interface Props {
  tool: EditorTools;
  icon: string;
}

const ToolIcon = memo(({ tool, icon }: Props) => {
  const { tool: selectedTool, setTool } = useToolSelected();
  const isSelected = tool === selectedTool;

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

  return (
    <Tooltip text={toolName} hotkey={shortcut || undefined}>
      <button
        className={`tool-button ${isSelected ? "active" : ""}`}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        aria-label={`${toolName}${shortcut ? `, shortcut: ${shortcut}` : ""}`}
        aria-pressed={isSelected}
        role="button"
        type="button"
        tabIndex={0}>
        <i className={`ms-Icon ms-Icon--${icon}`} aria-hidden="true" />
      </button>
    </Tooltip>
  );
});

export default ToolIcon;
