import { useToolSelected } from "../contexts/ToolSelectedContext/useToolSelected";
import { getEditorToolInfo } from "../../../types/tools";
import { TOOL_OPTIONS_REGISTRY } from "../toolOptions/ToolOptionsRegistry";

/**
 * Contextual options strip: shows only the selected tool's options, looked up in
 * TOOL_OPTIONS_REGISTRY. Pan / Select render just the tool name (no options).
 */
export default function ToolOptionsStrip() {
  const { tool } = useToolSelected();
  const info = getEditorToolInfo(tool);
  const options = TOOL_OPTIONS_REGISTRY[tool] ?? [];

  return (
    <div className="flex h-11 shrink-0 items-center gap-3 border-b border-line bg-surface-raised px-3">
      <span className="text-sm font-semibold text-ink">
        {info?.name ?? tool}
      </span>
      {options.length > 0 && <span className="h-5 w-px bg-line" />}
      {options.map(({ id, Component }) => (
        <Component key={id} />
      ))}
    </div>
  );
}
