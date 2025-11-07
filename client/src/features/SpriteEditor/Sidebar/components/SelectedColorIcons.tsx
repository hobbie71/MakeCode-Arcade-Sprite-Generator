import { useColorSelected } from "../../../../features/SpriteEditor/contexts/ColorSelectedContext/useColorSelected";
import { MakeCodeColor } from "../../../../types/color";
import { getHexFromMakeCodeColor } from "../../../../utils/colors/getColorFromMakeCodeColor";
import Tooltip from "../../../../components/Tooltip";
import { useKeyboardShortcut } from "../../../../hooks/useKeyboardShortcut";
import type { KeyboardShortcut } from "../../../../hooks/useKeyboardShortcut";

const ICON_SIZE = 32; // px

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

  const getColorName = (makeCodeColor: MakeCodeColor): string => {
    // Find the key name from the enum value
    const colorKey = Object.keys(MakeCodeColor).find(
      (key) =>
        MakeCodeColor[key as keyof typeof MakeCodeColor] === makeCodeColor
    );

    if (!colorKey) return "Unknown";

    // Convert enum key to readable name (e.g., "LIGHT_BLUE" -> "Light Blue")
    return colorKey
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char: string) => char.toUpperCase());
  };

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
        className="relative w-full my-2 rounded"
        style={{ height: ICON_SIZE + 8 }} // +8 for overlap
        onClick={swapColors}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
        role="button"
        type="button"
        tabIndex={0}>
        <div
          className={`absolute border border-black rounded-lg w-4/5 top-0 left-0 z-10 shadow-default-lg pointer-events-none ${color === MakeCodeColor.TRANSPARENT ? "transparent" : ""}`}
          style={{
            height: ICON_SIZE,
            backgroundColor: getHexFromMakeCodeColor(color),
          }}
          aria-hidden="true"
          tabIndex={-1}
        />
        <div
          className={`absolute border border-black rounded-lg w-4/5 bottom-0 right-0 z-0 shadow-default-lg pointer-events-none ${alternateColor === MakeCodeColor.TRANSPARENT ? "transparent" : ""}`}
          style={{
            height: ICON_SIZE,
            backgroundColor: getHexFromMakeCodeColor(alternateColor),
          }}
          aria-hidden="true"
        />
      </button>
    </Tooltip>
  );
};

export default SelectedColorIcons;
