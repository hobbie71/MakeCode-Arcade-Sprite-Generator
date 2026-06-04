import { useEffect } from "react";

// Context imports
import { useSelectionArea } from "../contexts/SelectionArea/useSelectionArea";
import { useToolSelected } from "../contexts/ToolSelectedContext/useToolSelected";

// Type imports
import { PIXEL_SIZE } from "../constants/canvas";

interface Props {
  width: number;
  height: number;
  pixelSize?: number;
  offset: { x: number; y: number };
  zoom: number;
}

const SelectionOverlay = ({
  width,
  height,
  pixelSize = PIXEL_SIZE,
  offset,
  zoom,
}: Props) => {
  const { selectionArea, setSelectionArea } = useSelectionArea();
  const { tool } = useToolSelected();

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

  // Coordinates are in the canvas's own (untransformed) pixel space. The wrapper
  // below applies the SAME transform as the <canvas> (and PreviewCanvas), so the
  // rectangle tracks zoom/pan instead of being pinned to raw minX*PIXEL_SIZE.
  const left = minX * pixelSize;
  const top = minY * pixelSize;
  const boxWidth = (maxX - minX + 1) * pixelSize;
  const boxHeight = (maxY - minY + 1) * pixelSize;

  return (
    <div
      className="absolute z-20"
      style={{
        width: width * pixelSize,
        height: height * pixelSize,
        transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
        transformOrigin: "50% 50%",
        pointerEvents: "none",
      }}>
      {/* Visual marquee only — pointer-events stay off so the drag-to-select
          gesture reaches the canvas underneath. */}
      <div
        className="absolute border-2 border-dashed border-accent"
        style={{
          top,
          left,
          width: boxWidth,
          height: boxHeight,
        }}>
        <span className="absolute -left-1.5 -top-1.5 h-2.5 w-2.5 border-2 border-accent bg-surface-raised" />
        <span className="absolute -right-1.5 -top-1.5 h-2.5 w-2.5 border-2 border-accent bg-surface-raised" />
        <span className="absolute -bottom-1.5 -left-1.5 h-2.5 w-2.5 border-2 border-accent bg-surface-raised" />
        <span className="absolute -bottom-1.5 -right-1.5 h-2.5 w-2.5 border-2 border-accent bg-surface-raised" />
      </div>
    </div>
  );
};

export default SelectionOverlay;
