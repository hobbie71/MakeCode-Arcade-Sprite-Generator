import ColorIcons from "../Sidebar/components/ColorIcons";
import { useColorSelected } from "../contexts/ColorSelectedContext/useColorSelected";
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";
import { getColorName, MakeCodeColor, ALL_PALETTES } from "../../../types/color";
import { getHexFromMakeCodeColor } from "../../../utils/colors/getColorFromMakeCodeColor";

/**
 * Right-dock palette section (mockup 04-studio): palette picker, the Arcade
 * swatch grid, the selected-color readout, and a placeholder for the future
 * dock panels (layers, animation, AI variations, history).
 */
export default function PalettePanel() {
  const { color } = useColorSelected();
  const { palette, setPalette } = usePaletteSelected();
  const hex = getHexFromMakeCodeColor(color);
  const paletteIndex = Math.max(
    0,
    ALL_PALETTES.findIndex((p) => p.palette === palette)
  );

  return (
    <div className="space-y-3">
      {/* Palette picker */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-ink">Palette</span>
        <select
          aria-label="Palette"
          className="rounded-md border border-line bg-surface-raised px-2 py-1 text-sm text-ink focus:border-accent focus:outline-none"
          value={paletteIndex}
          onChange={(e) =>
            setPalette(ALL_PALETTES[Number(e.target.value)].palette)
          }>
          {ALL_PALETTES.map((p, i) => (
            <option key={p.name} value={i}>
              {p.name}
            </option>
          ))}
        </select>
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

      {/* Future dock sections (placeholder, mirrors the mockup) */}
      <div className="rounded-md border border-line bg-surface p-3">
        <div className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
          <span aria-hidden>⚙</span> Coming soon
        </div>
        <p className="mt-1 text-xs leading-relaxed text-ink-subtle">
          This dock will also host layers, animation frames, AI variations and
          edit history.
        </p>
      </div>
    </div>
  );
}
