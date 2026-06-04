import { useColorSelected } from "../contexts/ColorSelectedContext/useColorSelected";
import { getColorName, MakeCodeColor } from "../../../types/color";
import { getHexFromMakeCodeColor } from "../../../utils/colors/getColorFromMakeCodeColor";

/**
 * Current-color badge floating at the top-left of the canvas stage (see the
 * 04-studio mockup): a swatch of the active color plus its name.
 */
export default function CanvasColorBadge() {
  const { color } = useColorSelected();
  const hex = getHexFromMakeCodeColor(color);
  const isTransparent = color === MakeCodeColor.TRANSPARENT;

  return (
    <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-chip border border-line bg-surface-raised px-3 py-1.5 text-sm font-medium text-ink shadow-md">
      <span
        className={`h-4 w-4 shrink-0 rounded border border-line ${
          isTransparent ? "transparent" : ""
        }`}
        style={{ backgroundColor: hex }}
        aria-hidden="true"
      />
      {getColorName(color)}
    </div>
  );
}
