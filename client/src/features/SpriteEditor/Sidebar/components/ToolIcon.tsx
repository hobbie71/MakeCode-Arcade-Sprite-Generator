import { memo } from "react";
import { useToolSelected } from "../../../../features/SpriteEditor/contexts/ToolSelectedContext/useToolSelected";
import { EditorTools } from "../../../../types/tools";

interface Props {
  tool: EditorTools;
  icon: string;
}

const ToolIcon = memo(({ tool, icon }: Props) => {
  const { tool: selectedTool, setTool } = useToolSelected();
  const isSelected = tool === selectedTool;

  return (
    <button
      className={`tool-button ${isSelected ? "active" : ""}`}
      onClick={() => setTool(tool)}
      aria-label={tool}
      type="button">
      <i className={`ms-Icon ms-Icon--${icon}`} aria-hidden="true" />
    </button>
  );
});

ToolIcon.displayName = "ToolIcon";

export default ToolIcon;
