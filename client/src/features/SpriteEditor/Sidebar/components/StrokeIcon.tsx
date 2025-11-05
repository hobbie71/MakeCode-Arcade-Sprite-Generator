import { useEffect, useState, useId, useRef } from "react";

// Context import
import { useStrokeSize } from "../../contexts/StrokeSizeContext/useStrokeSize";

// Type imports
import type { StrokeSize } from "../../../../types/pixel";

interface Props {
  strokeSize: StrokeSize;
}

const StrokeIcon = ({ strokeSize }: Props) => {
  const { strokeSize: currentStrokeSize, setStrokeSize } = useStrokeSize();
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [isHover, setIsHover] = useState<boolean>(false);
  const tooltipId = useId();
  const buttonId = useId();
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const strokeLabel = `${strokeSize}px stroke`;

  const handleMouseDown = () => {
    setStrokeSize(strokeSize);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        setStrokeSize(strokeSize);
        break;
      default:
        break;
    }
  };

  const handleMouseEnter = () => {
    setIsHover(true);

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
    setIsHover(false);

    // Clear timeout and hide tooltip
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowTooltip(false);
  };

  useEffect(
    () =>
      strokeSize === currentStrokeSize
        ? setIsSelected(true)
        : setIsSelected(false),
    [currentStrokeSize, strokeSize]
  );

  return (
    <div className="relative inline-flex">
      <div
        className="flex items-center justify-center cursor-pointer"
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          padding: Math.max(8 - strokeSize, 0),
        }}>
        <button
          id={buttonId}
          className={`rounded-sm shadow-default-lg transition-color ${isSelected || isHover ? "bg-white" : "bg-text-default-100"}`}
          onKeyDown={handleKeyDown}
          aria-label={strokeLabel}
          aria-pressed={isSelected}
          aria-describedby={showTooltip ? tooltipId : undefined}
          role="button"
          type="button"
          tabIndex={0}
          style={{
            width: 8 + (strokeSize - 1) * 2,
            height: 8 + (strokeSize - 1) * 2,
          }}
        />
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-50
                     px-1.5 py-0.5 text-[10px] font-normal text-text-default-300 bg-default-200 
                     shadow-default-lg rounded pointer-events-none whitespace-nowrap"
          aria-hidden="false">
          <span>{strokeLabel}</span>
        </div>
      )}
    </div>
  );
};

export default StrokeIcon;
