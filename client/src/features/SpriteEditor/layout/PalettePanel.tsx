import ColorIcons from "../Sidebar/components/ColorIcons";
import DefaultDropDown from "../../../components/DefaultDropDown";
import { useColorSelected } from "../contexts/ColorSelectedContext/useColorSelected";
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";
import { getColorName, MakeCodeColor, PALETTE_OPTIONS } from "../../../types/color";
import { getHexFromMakeCodeColor } from "../../../utils/colors/getColorFromMakeCodeColor";

/**
 * Right-dock palette section (mockup 04-studio): palette picker, the Arcade
 * swatch grid, and the selected-color readout.
 */
export default function PalettePanel() {
  const { color } = useColorSelected();
  const { palette, setPalette } = usePaletteSelected();
  const hex = getHexFromMakeCodeColor(color);
  const paletteIndex = Math.max(
    0,
    PALETTE_OPTIONS.findIndex((p) => p.palette === palette)
  );

  return (
    <div className="space-y-3">
      {/* Palette picker */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-ink">Palette</span>
        <DefaultDropDown
          ariaLabel="Palette"
          options={PALETTE_OPTIONS}
          value={paletteIndex}
          onChange={(index) => setPalette(PALETTE_OPTIONS[index].palette)}
        />
      </div>

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
