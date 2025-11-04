import { useEffect, useState } from "react";

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
  const [isHover, setIsHover] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const key = e.key;

    if (
      key === "Enter" ||
      key === " " ||
      key === "Spacebar" ||
      key === "Space"
    ) {
      // Prevent page from scrolling when Space is pressed
      e.preventDefault();
      setStrokeSize(strokeSize);
    }
  };

  useEffect(
    () =>
      strokeSize === currentStrokeSize
        ? setIsSelected(true)
        : setIsSelected(false),
    [currentStrokeSize, strokeSize]
  );

  return (
    <div
      className="stroke-icon-container"
      onClick={() => setStrokeSize(strokeSize)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        padding: Math.max(8 - strokeSize, 0),
      }}>
      <div
        className={`rounded-sm  shadow-default-lg transition-color ${isHover || isSelected ? "bg-white" : "bg-text-default-100"}`}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        style={{
          width: 8 + (strokeSize - 1) * 2,
          height: 8 + (strokeSize - 1) * 2,
        }}
      />
    </div>
  );
};

export default StrokeIcon;
