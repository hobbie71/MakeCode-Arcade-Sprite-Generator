import { memo } from "react";

// Context imports
import { useColorSelected } from "../../contexts/ColorSelectedContext/useColorSelected";

// Type imports
import { MakeCodeColor } from "../../../../types/color";
import type { MakeCodePalette } from "../../../../types/color";
import { getColorName } from "../../../../types/color";
import type { KeyboardShortcut } from "../../../../hooks/useKeyboardShortcut";

// Hook imports
import { useKeyboardShortcut } from "../../../../hooks/useKeyboardShortcut";

// Util imports
import { getHexFromMakeCodeColor } from "../../../../utils/colors/getColorFromMakeCodeColor";

// Component imports
import Tooltip from "../../../../components/Tooltip";

interface Props {
  color: MakeCodeColor;
  palette: MakeCodePalette;
}

const ColorIcon = memo(({ color, palette }: Props) => {
  const { setColor, color: currentColor } = useColorSelected();

  // Check if the color key is a letter (a-f) to determine if shift is needed
  const isLetter = /[a-f]/i.test(color);

  const shortcut: KeyboardShortcut[] = [
    {
      key: color,
      shift: isLetter,
      callback: () => setColor(color),
    },
  ];

  useKeyboardShortcut(shortcut);

  const colorName = getColorName(color);
  const hexColor = getHexFromMakeCodeColor(color, palette);
  const colorLabel =
    color === MakeCodeColor.TRANSPARENT
      ? "Transparent"
      : `${colorName} (${hexColor})`;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        setColor(color);
        break;
      default:
        break;
    }
  };

  const hotkeyDisplay = isLetter ? `Shift+${color.toUpperCase()}` : color;

  return (
    <Tooltip text={colorLabel} hotkey={hotkeyDisplay}>
      <button
        className={`color-swatch ${color === MakeCodeColor.TRANSPARENT ? "transparent" : ""}`}
        onClick={() => setColor(color)}
        onKeyDown={handleKeyDown}
        aria-label={`Select ${colorLabel}`}
        aria-pressed={currentColor === color}
        role="button"
        type="button"
        tabIndex={0}
        style={{
          backgroundColor: hexColor,
        }}
      />
    </Tooltip>
  );
});

ColorIcon.displayName = "ColorIcon";

export default ColorIcon;
