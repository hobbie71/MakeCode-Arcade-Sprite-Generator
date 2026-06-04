import ColorIcons from "../Sidebar/components/ColorIcons";
import { useColorSelected } from "../contexts/ColorSelectedContext/useColorSelected";
import { getColorName, MakeCodeColor } from "../../../types/color";
import { getHexFromMakeCodeColor } from "../../../utils/colors/getColorFromMakeCodeColor";

/** Right-dock palette section: the Arcade swatches + the selected-color readout. */
export default function PalettePanel() {
  const { color } = useColorSelected();
  const hex = getHexFromMakeCodeColor(color);

  return (
    <div className="space-y-3">
      <ColorIcons />
      <div className="flex items-center gap-2 rounded-md border border-line p-2">
        <span
          className={`h-9 w-9 shrink-0 rounded border border-line ${
            color === MakeCodeColor.TRANSPARENT ? "transparent" : ""
          }`}
          style={{ backgroundColor: hex }}
          aria-hidden="true"
        />
        <div className="min-w-0 text-xs">
          <div className="font-medium text-ink">{getColorName(color)}</div>
          <div className="text-ink-subtle">
            index {color} · {hex}
          </div>
        </div>
      </div>
    </div>
  );
}
