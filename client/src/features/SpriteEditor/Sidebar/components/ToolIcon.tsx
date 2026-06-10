import { memo } from "react";
import { useToolSelected } from "../../../../features/SpriteEditor/contexts/ToolSelectedContext/useToolSelected";
import { EditorTools, ALL_EDITOR_TOOLS } from "../../../../types/tools";
import IconButton from "../../../../components/IconButton";
import Tooltip from "../../../../components/Tooltip";
import LineToolIcon from "./LineToolIcon";

interface Props {
  tool: EditorTools;
  icon: string;
}

const ToolIcon = memo(({ tool, icon }: Props) => {
  const { tool: selectedTool, setTool } = useToolSelected();
  const isSelected = tool === selectedTool;

  // Get tool info from ALL_EDITOR_TOOLS
  const toolInfo = ALL_EDITOR_TOOLS.find((t) => t.tool === tool);
  const toolName = toolInfo?.name || tool;
  const shortcut = toolInfo?.shortcut || "";

  const handleMouseDown = () => {
    setTool(tool);
  };

  // Activation is mousedown-based (not click), so the native button's
  // Enter/Space-fires-click path never runs — handle keys explicitly.
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
      <IconButton
        pressed={isSelected}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        aria-label={`${toolName}${shortcut ? `, shortcut: ${shortcut}` : ""}`}>
        {tool === EditorTools.Line ? (
          <LineToolIcon className={isSelected ? "" : "text-ink-muted"} />
        ) : (
          <i className={`ms-Icon ms-Icon--${icon}`} aria-hidden="true" />
        )}
      </IconButton>
    </Tooltip>
  );
});

export default ToolIcon;
