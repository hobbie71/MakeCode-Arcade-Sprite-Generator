import { IconButton } from "../../../components/IconButton";
import Tooltip from "../../../components/Tooltip";
import { useSelection } from "../contexts/SelectionContext/useSelection";
import {
  FlipHorizontalIcon,
  FlipVerticalIcon,
  RotateLeftIcon,
  RotateRightIcon,
} from "./SelectionActionIcons";

/**
 * Flip H / Flip V / Rotate left / Rotate right actions on the active selection.
 * They operate on the floating selection, auto-lifting first when only a mask
 * exists. Disabled when there's nothing selected (idle) or a marquee is
 * mid-draw.
 */
export default function SelectionActionsOption() {
  const { phase, flipHorizontal, flipVertical, rotate90, rotate90CCW } =
    useSelection();
  const disabled = phase === "idle" || phase === "drawing";

  return (
    <div className="flex items-center gap-1">
      <Tooltip text="Flip horizontal">
        <IconButton
          size="sm"
          aria-label="Flip horizontal"
          disabled={disabled}
          onClick={flipHorizontal}>
          <FlipHorizontalIcon />
        </IconButton>
      </Tooltip>
      <Tooltip text="Flip vertical">
        <IconButton
          size="sm"
          aria-label="Flip vertical"
          disabled={disabled}
          onClick={flipVertical}>
          <FlipVerticalIcon />
        </IconButton>
      </Tooltip>
      <Tooltip text="Rotate left">
        <IconButton
          size="sm"
          aria-label="Rotate left 90 degrees"
          disabled={disabled}
          onClick={rotate90CCW}>
          <RotateLeftIcon />
        </IconButton>
      </Tooltip>
      <Tooltip text="Rotate right">
        <IconButton
          size="sm"
          aria-label="Rotate right 90 degrees"
          disabled={disabled}
          onClick={rotate90}>
          <RotateRightIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}
