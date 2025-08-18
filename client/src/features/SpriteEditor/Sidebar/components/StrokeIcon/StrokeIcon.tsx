import { useEffect, useState } from "react";

// Style import
import "./StrokeIcon.css";

// Context import
import { useToolSelected } from "@/features/SpriteEditor/contexts/ToolSelectedContext/useToolSelected";

interface Props {
  strokeSize: number;
}

const StrokeIcon = ({ strokeSize }: Props) => {
  const { strokeSize: currentStrokeSize, setStrokeSize } = useToolSelected();
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
        className={`
          stroke-icon rounded-sm
          ${isSelected ? "selected" : ""}  
        `}
        style={{
          backgroundColor: "#adadad",
          width: 8 + (strokeSize - 1) * 2,
          height: 8 + (strokeSize - 1) * 2,
        }}
      />
    </div>
  );
};

export default StrokeIcon;
