import { useEffect, useState } from "react";

// Context import
import { useStrokeSize } from "../../contexts/StrokeSizeContext/useStrokeSize";

// Type imports
import type { StrokeSize } from "../../../../types/pixel";

// Component imports
import Tooltip from "../../../../components/Tooltip";

interface Props {
  strokeSize: StrokeSize;
}

const StrokeIcon = ({ strokeSize }: Props) => {
  const { strokeSize: currentStrokeSize, setStrokeSize } = useStrokeSize();
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [isHover, setIsHover] = useState<boolean>(false);

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
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  useEffect(
    () =>
      strokeSize === currentStrokeSize
        ? setIsSelected(true)
        : setIsSelected(false),
    [currentStrokeSize, strokeSize]
  );

  return (
    <Tooltip text={strokeLabel}>
      <div
        className="flex items-center justify-center cursor-pointer"
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          padding: Math.max(8 - strokeSize, 0),
        }}>
        <button
          className={`rounded-sm shadow-default-lg transition-color ${isSelected || isHover ? "bg-white" : "bg-text-default-100"}`}
          onKeyDown={handleKeyDown}
          aria-label={strokeLabel}
          aria-pressed={isSelected}
          role="button"
          type="button"
          tabIndex={0}
          style={{
            width: 8 + (strokeSize - 1) * 2,
            height: 8 + (strokeSize - 1) * 2,
          }}
        />
      </div>
    </Tooltip>
  );
};

export default StrokeIcon;
