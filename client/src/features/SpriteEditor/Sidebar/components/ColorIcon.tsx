import { memo, useState, useRef, useId } from "react";

// Context imports
import { useColorSelected } from "../../contexts/ColorSelectedContext/useColorSelected";

// Type imports
import { MakeCodeColor } from "../../../../types/color";
import type { MakeCodePalette } from "../../../../types/color";

// Util imports
import { getHexFromMakeCodeColor } from "../../../../utils/colors/getColorFromMakeCodeColor";

interface Props {
  color: MakeCodeColor;
  palette: MakeCodePalette;
}

const ColorIcon = memo(({ color, palette }: Props) => {
  const { setColor, color: currentColor } = useColorSelected();
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();
  const buttonId = useId();

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

  const colorName = getColorName(color);
  const hexColor = getHexFromMakeCodeColor(color, palette);
  const colorLabel =
    color === MakeCodeColor.TRANSPARENT
      ? "Transparent"
      : `${colorName} (${hexColor})`;

  const handleMouseEnter = () => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // Show tooltip after 500ms delay
    hoverTimeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    // Clear timeout and hide tooltip
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowTooltip(false);
  };

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
    <div className="color-container relative">
      <button
        id={buttonId}
        className={`color-swatch ${color === MakeCodeColor.TRANSPARENT ? "transparent" : ""}`}
        onClick={() => setColor(color)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        aria-label={`Select ${colorLabel}`}
        aria-pressed={currentColor === color}
        aria-describedby={showTooltip ? tooltipId : undefined}
        role="button"
        type="button"
        tabIndex={0}
        style={{
          backgroundColor: hexColor,
        }}
      />
      {/* Tooltip */}
      {showTooltip && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-50
                     px-1.5 py-0.5 text-[10px] font-normal text-text-default-300 bg-default-200 
                     shadow-default-lg rounded pointer-events-none whitespace-nowrap"
          aria-hidden="false">
          <span>{colorLabel}</span>
        </div>
      )}
    </div>
  );
});

ColorIcon.displayName = "ColorIcon";

export default ColorIcon;
