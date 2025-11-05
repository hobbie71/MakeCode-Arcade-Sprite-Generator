import { useId, useRef, useState } from "react";
import { useColorSelected } from "../../../../features/SpriteEditor/contexts/ColorSelectedContext/useColorSelected";
import { MakeCodeColor } from "../../../../types/color";
import { getHexFromMakeCodeColor } from "../../../../utils/colors/getColorFromMakeCodeColor";

const ICON_SIZE = 32; // px

const SelectedColorIcons = () => {
  const { color, setColor, alternateColor, setAlternateColor } =
    useColorSelected();
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipId = useId();
  const buttonId = useId();
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const swapColors = () => {
    const prevColor = color;
    setColor(alternateColor);
    setAlternateColor(prevColor);
  };

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

  return (
    <div className="relative inline-block w-full">
      <button
        id={buttonId}
        className="relative w-full my-2 rounded"
        style={{ height: ICON_SIZE + 8 }} // +8 for overlap
        onClick={swapColors}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={ariaLabel}
        aria-describedby={showTooltip ? tooltipId : undefined}
        role="button"
        type="button"
        tabIndex={0}>
        <div
          className={`absolute border border-black rounded-lg w-4/5 top-0 left-0 z-10 shadow-default-lg ${color === MakeCodeColor.TRANSPARENT ? "transparent" : ""}`}
          style={{
            height: ICON_SIZE,
            backgroundColor: getHexFromMakeCodeColor(color),
          }}
          aria-hidden="true"
        />
        <div
          className={`absolute border border-black rounded-lg w-4/5 bottom-0 right-0 z-0 shadow-default-lg ${alternateColor === MakeCodeColor.TRANSPARENT ? "transparent" : ""}`}
          style={{
            height: ICON_SIZE,
            backgroundColor: getHexFromMakeCodeColor(alternateColor),
          }}
          aria-hidden="true"
        />
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-50
                     px-1.5 py-0.5 text-[10px] font-normal text-text-default-300 bg-default-200 
                     shadow-default-lg rounded pointer-events-none whitespace-nowrap"
          aria-hidden="false">
          <span>
            Swap colors ({primaryColorName} ↔ {secondaryColorName})
          </span>
        </div>
      )}
    </div>
  );
};

export default SelectedColorIcons;
