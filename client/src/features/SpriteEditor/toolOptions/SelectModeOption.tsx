import SegmentedControl from "../../../components/SegmentedControl";
import { useSelectOptions } from "../contexts/SelectOptionsContext/useSelectOptions";
import type { SelectionMode } from "../contexts/SelectOptionsContext/SelectOptionsContext";

/**
 * Selection mode picker (Rectangle / Wand / Lasso). Wired to
 * SelectOptionsContext, which useSelectTool reads to decide how an
 * outside-the-selection gesture creates the next selection. Pressing S while
 * Select is active cycles through these.
 */
export default function SelectModeOption() {
  const { mode, setMode } = useSelectOptions();
  return (
    <SegmentedControl<SelectionMode>
      size="sm"
      label="Mode"
      ariaLabel="Selection mode"
      value={mode}
      onChange={setMode}
      options={[
        { value: "rectangle", label: "Rect" },
        { value: "wand", label: "Wand" },
        // Lasso is added in the lasso phase.
      ]}
    />
  );
}
