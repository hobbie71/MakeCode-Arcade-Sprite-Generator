import { useColorSelected } from "../contexts/ColorSelectedContext/useColorSelected";
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";
import { MakeCodeColor, ColorOrder, getColorName } from "../../../types/color";
import { getHexFromMakeCodeColor } from "../../../utils/colors/getColorFromMakeCodeColor";
import Tooltip from "../../../components/Tooltip";
import { useRovingFocusMenu } from "./useRovingFocusMenu";

// The 16 MakeCode colors lay out as a clean 4×4 grid.
const COLUMNS = 4;

/** Tooltip label for a swatch: a bare "Transparent" or "<name> (<hex>)". */
function swatchLabel(color: MakeCodeColor, hex: string): string {
  if (color === MakeCodeColor.TRANSPARENT) return "Transparent";
  return `${getColorName(color)} (${hex})`;
}

/** Keyboard hint matching the right-dock ColorIcon shortcuts: letter slots
 *  (a–f) need Shift, the digit/"." slots are bare. */
function swatchHotkey(color: MakeCodeColor): string {
  const isLetter = /[a-f]/i.test(color);
  return isLetter ? `Shift+${color.toUpperCase()}` : color;
}

interface Props {
  /** Positioning classes for the floating root, e.g. "absolute left-4 top-4". */
  className?: string;
}

/**
 * Top-left current-color control: a pill showing the active color (swatch +
 * name) that opens a downward popover — a plain 4×4 grid of all 16 MakeCode
 * colors — for quickly picking a colour without travelling to the right-dock
 * palette. The colour analogue of the bottom-left SizeMenu. Open/close,
 * outside-click + Escape, and roving-focus keyboard nav come from
 * {@link useRovingFocusMenu}.
 */
export default function ColorMenu({
  className = "absolute left-4 top-4",
}: Props) {
  const { color, setColor } = useColorSelected();
  const { palette } = usePaletteSelected();

  const { open, setOpen, close, rootRef, triggerRef, itemRefs, handleItemKeyDown } =
    useRovingFocusMenu({
      itemCount: ColorOrder.length,
      initialIndex: ColorOrder.indexOf(color),
      columns: COLUMNS,
    });

  const triggerHex = getHexFromMakeCodeColor(color, palette);
  const triggerTransparent = color === MakeCodeColor.TRANSPARENT;

  return (
    <div ref={rootRef} className={className}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Current color: ${getColorName(color)}. Change color`}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-chip border border-line bg-surface-raised px-3 py-1.5 text-sm font-medium text-ink shadow-md transition-colors hover:bg-surface-hover">
        <span
          className={`h-4 w-4 shrink-0 rounded border border-line ${
            triggerTransparent ? "transparent" : ""
          }`}
          style={{ backgroundColor: triggerHex }}
          aria-hidden="true"
        />
        {getColorName(color)}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Select color"
          className="absolute left-0 top-full z-30 mt-2 grid gap-1.5 rounded-card border border-line bg-surface-raised p-2 shadow-lg"
          style={{ gridTemplateColumns: `repeat(${COLUMNS}, 2rem)` }}>
          {ColorOrder.map((c, index) => {
            const hex = getHexFromMakeCodeColor(c, palette);
            const isTransparent = c === MakeCodeColor.TRANSPARENT;
            const selected = color === c;

            return (
              <Tooltip
                key={c}
                text={swatchLabel(c, hex)}
                hotkey={swatchHotkey(c)}
                placement="right"
                className="h-8 w-8">
                <button
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  type="button"
                  role="menuitemradio"
                  aria-checked={selected}
                  aria-label={swatchLabel(c, hex)}
                  tabIndex={-1}
                  onClick={() => {
                    setColor(c);
                    close();
                  }}
                  onKeyDown={(e) => handleItemKeyDown(e, index)}
                  className={`h-8 w-8 rounded shadow-sm transition-transform hover:scale-110 focus:outline-none ${
                    isTransparent ? "transparent" : ""
                  } ${
                    selected
                      ? "ring-2 ring-accent ring-offset-1 ring-offset-surface-raised"
                      : "border border-line"
                  }`}
                  style={{ backgroundColor: hex }}
                />
              </Tooltip>
            );
          })}
        </div>
      )}
    </div>
  );
}
