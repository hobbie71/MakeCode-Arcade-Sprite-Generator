import { memo } from "react";

// Context imports
import { useColorSelected } from "../../contexts/ColorSelectedContext/useColorSelected";

// Type imports
import { MakeCodeColor } from "../../../../types/color";
import type { MakeCodePalette } from "../../../../types/color";
import { getColorName } from "../../../../types/color";

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

  return (
    <Tooltip text={colorLabel}>
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
