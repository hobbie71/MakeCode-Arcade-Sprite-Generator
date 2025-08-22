import { memo } from "react";
import { useToolSelected } from "@/features/SpriteEditor/contexts/ToolSelectedContext/useToolSelected";
import { EditorTools } from "@/types/tools";

interface Props {
  tool: EditorTools;
  icon: string;
}

const ToolIcon = memo(({ tool, icon }: Props) => {
  const { tool: selectedTool, setTool } = useToolSelected();
  const isSelected = tool === selectedTool;

  return (
    <button
      className={`
        w-7 h-7 flex items-center justify-center
        bg-transparent outline-none shadow-none cursor-pointer
        focus:outline-none focus:shadow-none
        hover:text-neutral-200
        ${isSelected ? "border border-white border-solid text-white" : "text-neutral-400"}
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
