// Style import
import "./ToolIcon.css";
import { memo } from "react";

// Context imports
import { useToolSelected } from "@/features/SpriteEditor/contexts/ToolSelectedContext/useToolSelected";

// Type imports
import { EditorTools } from "@/types/tools";

interface Props {
  tool: EditorTools;
  icon: string;
}

const ToolIcon = memo(({ tool, icon }: Props) => {
  // Hooks
  const { tool: selectedTool, setTool } = useToolSelected();

  // Calculate selection state directly
  const isSelected = tool === selectedTool;

  return (
    <button
      className={`
        tool-icon w-7 h-7 flex items-center justify-center
        ${isSelected ? "selected" : ""}
      `}
      onClick={() => setTool(tool)}
      aria-label={tool}
      type="button">
      <i className={`ms-Icon ms-Icon--${icon}`} aria-hidden="true" />
    </button>
  );
});

ToolIcon.displayName = "ToolIcon";

export default ToolIcon;
