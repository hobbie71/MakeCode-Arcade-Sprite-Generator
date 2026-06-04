import { useColorSelected } from "../../../../features/SpriteEditor/contexts/ColorSelectedContext/useColorSelected";
import { MakeCodeColor } from "../../../../types/color";
import { getHexFromMakeCodeColor } from "../../../../utils/colors/getColorFromMakeCodeColor";
import Tooltip from "../../../../components/Tooltip";
import { useKeyboardShortcut } from "../../../../hooks/useKeyboardShortcut";
import type { KeyboardShortcut } from "../../../../hooks/useKeyboardShortcut";
import { getColorName } from "../../../../types/color";

/**
 * Compact current-color chip for the left rail: a swatch of the primary color
 * with the secondary peeking behind it. Click (or press X) swaps primary and
 * secondary. Sized to sit inside the narrow rail — it never overflows or clips.
 */
const SelectedColorIcons = () => {
  const { color, setColor, alternateColor, setAlternateColor } =
    useColorSelected();

  const swapColors = () => {
    const prevColor = color;
    setColor(alternateColor);
    setAlternateColor(prevColor);
  };

  const shortcut: KeyboardShortcut[] = [{ key: "x", callback: swapColors }];
  useKeyboardShortcut(shortcut);

  const primaryColorName = getColorName(color);
  const secondaryColorName = getColorName(alternateColor);
  const ariaLabel = `Swap colors. Primary: ${primaryColorName}, Secondary: ${secondaryColorName}`;
  const tooltipText = `Swap colors (${primaryColorName} ↔ ${secondaryColorName})`;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        swapColors();
        break;
      default:
        break;
    }
  };

  return (
    <Tooltip text={tooltipText} hotkey="x">
      <button
        className="relative h-8 w-8 shrink-0"
        onClick={swapColors}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
        type="button"
        tabIndex={0}>
        {/* Secondary swatch, offset behind the primary */}
        <span
          className={`absolute bottom-0 right-0 h-5 w-5 rounded-md border border-line shadow-xs ${
            alternateColor === MakeCodeColor.TRANSPARENT ? "transparent" : ""
          }`}
          style={{ backgroundColor: getHexFromMakeCodeColor(alternateColor) }}
          aria-hidden="true"
        />
        {/* Primary swatch, on top */}
        <span
          className={`absolute left-0 top-0 h-5 w-5 rounded-md border border-line shadow-sm ${
            color === MakeCodeColor.TRANSPARENT ? "transparent" : ""
          }`}
          style={{ backgroundColor: getHexFromMakeCodeColor(color) }}
          aria-hidden="true"
        />
      </button>
    </Tooltip>
  );
};

export default SelectedColorIcons;
