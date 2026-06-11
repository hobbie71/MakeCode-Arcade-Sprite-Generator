import { IconButton } from "../../../components/IconButton";
import Tooltip from "../../../components/Tooltip";
import { useSelection } from "../contexts/SelectionContext/useSelection";

/**
 * Flip H / Flip V / Rotate 90° actions on the active selection. They operate on
 * the floating selection, auto-lifting first when only a mask exists. Disabled
 * when there's nothing selected (idle) or a marquee is mid-draw.
 */
export default function SelectionActionsOption() {
  const { phase, flipHorizontal, flipVertical, rotate90 } = useSelection();
  const disabled = phase === "idle" || phase === "drawing";

  return (
    <div className="flex items-center gap-1">
      <Tooltip text="Flip horizontal">
        <IconButton
          size="sm"
          aria-label="Flip horizontal"
          disabled={disabled}
          onClick={flipHorizontal}>
          <i className="ms-Icon ms-Icon--FlipHorizontal" aria-hidden="true" />
        </IconButton>
      </Tooltip>
      <Tooltip text="Flip vertical">
        <IconButton
          size="sm"
          aria-label="Flip vertical"
          disabled={disabled}
          onClick={flipVertical}>
          <i className="ms-Icon ms-Icon--FlipVertical" aria-hidden="true" />
        </IconButton>
      </Tooltip>
      <Tooltip text="Rotate 90°">
        <IconButton
          size="sm"
          aria-label="Rotate 90 degrees"
          disabled={disabled}
          onClick={rotate90}>
          <i className="ms-Icon ms-Icon--Rotate" aria-hidden="true" />
        </IconButton>
      </Tooltip>
    </div>
  );
}
