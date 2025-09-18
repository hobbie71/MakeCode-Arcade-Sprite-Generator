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

  useEffect(
    () =>
      strokeSize === currentStrokeSize
        ? setIsSelected(true)
        : setIsSelected(false),
    [currentStrokeSize, strokeSize]
  );

  return (
    <div
      className="stroke-icon-container hover:opacity-60 transition-opacity"
      onClick={() => setStrokeSize(strokeSize)}
      style={{
        padding: Math.max(8 - strokeSize, 0),
      }}>
      <div
        className="rounded-sm bg-white"
        style={{
          backgroundColor: "#adadad",
          width: 8 + (strokeSize - 1) * 2,
          height: 8 + (strokeSize - 1) * 2,
          opacity: `${isSelected ? 0.6 : 1}`,
        }}
      />
    </div>
  );
};

export default StrokeIcon;
