import { useEffect, useState } from "react";

// Context imports
import { useSelectionArea } from "../contexts/SelectionArea/useSelectionArea";
import { useToolSelected } from "../contexts/ToolSelectedContext/useToolSelected";

// Type imports
import { PIXEL_SIZE } from "../constants/canvas";

const SelectionOverlay = () => {
  const { selectionArea, setSelectionArea } = useSelectionArea();
  const { tool } = useToolSelected();
  const [isAdjustingSize, setIsAdjustingSize] = useState<boolean>(false);
  const [isMoving, setIsMoving] = useState<boolean>(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsMoving(true);
  };

  useEffect(() => {
    if (!isAdjustingSize) return;

    // TODO: Handle pixel reizing
  }, [isAdjustingSize]);

  useEffect(() => {
    if (!isMoving) return;
  }, [isMoving]);

  // Clear selection when tool changes
  useEffect(() => {
    if (tool !== "select") {
      setSelectionArea(null);
    }
  }, [tool, setSelectionArea]);

  if (!selectionArea) return null;

  const { start, end } = selectionArea;

  const minX = Math.min(start.x, end.x);
  const maxX = Math.max(start.x, end.x);
  const minY = Math.min(start.y, end.y);
  const maxY = Math.max(start.y, end.y);

  const left = minX * PIXEL_SIZE;
  const top = minY * PIXEL_SIZE;
  const width = (maxX - minX + 1) * PIXEL_SIZE;
  const height = (maxY - minY + 1) * PIXEL_SIZE;

  return (
    <div
      className="absolute border-2 border-dashed border-black cursor-grab "
      onMouseDown={handleMouseDown}
      onMouseUp={() => setIsMoving(false)}
      style={{
        top,
        left,
        width,
        height,
      }}>
      <div
        className="absolute w-3 h-3 bg-white border-2 border-black -top-3 -left-3 pointer-events-auto cursor-nw-resize"
        onMouseDown={() => setIsAdjustingSize(true)}
        onMouseUp={() => setIsAdjustingSize(false)}
      />
      <div
        className="absolute w-3 h-3 bg-white border-2 border-black -top-3 -right-3 pointer-events-auto cursor-ne-resize"
        onMouseDown={() => setIsAdjustingSize(true)}
        onMouseUp={() => setIsAdjustingSize(false)}
      />
      <div
        className="absolute w-3 h-3 bg-white border-2 border-black -bottom-3 -left-3 pointer-events-auto cursor-sw-resize"
        onMouseDown={() => setIsAdjustingSize(true)}
        onMouseUp={() => setIsAdjustingSize(false)}
      />
      <div
        className="absolute w-3 h-3 bg-white border-2 border-black -bottom-3 -right-3 pointer-events-auto cursor-se-resize"
        onMouseDown={() => setIsAdjustingSize(true)}
        onMouseUp={() => setIsAdjustingSize(false)}
      />
    </div>
  );
};

export default SelectionOverlay;
