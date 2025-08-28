import { useEffect, memo, useState } from "react";

// Context import
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useToolSelected } from "../contexts/ToolSelectedContext/useToolSelected";
import { useZoom } from "../contexts/ZoomContext/useZoom";
import { useCanvasSize } from "@/context/CanvasSizeContext/useCanvasSize";

// Utility imports
import {
  isValidMakeCodeSprite,
  parseMakeCodeSprite,
} from "@/utils/makeCodeSprite";

// Hook import
import { useSpriteEditorCanvas } from "../hooks/useSpriteEditorCanvas";
import { useMouseHandler } from "../hooks/useMouseHandler";
import { usePan } from "../hooks/usePan";
import { usePasteData } from "../hooks/usePasteData";

// Component imports
import SelectionOverlay from "./SelectionOverlay";
import ImportPreview from "./ImportPreview";

interface Props {
  width: number;
  height: number;
  pixelSize?: number;
}

const Canvas = memo(({ pixelSize = 20 }: Props) => {
  const { canvasRef } = useCanvas();
  const { tool } = useToolSelected();
  const { zoom } = useZoom();
  const { width, height } = useCanvasSize();

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const { initCanvas } = useSpriteEditorCanvas(width, height);
  const { pasteSpriteData } = usePasteData();

  const {
    handleMouseEnter,
    handleMouseMove,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp,
  } = useMouseHandler();

  const {
    handlePointerDown: handlePanDown,
    handlePointerMove: handlePanMove,
    handlePointerUp: handlePanUp,
    handlePointerLeave: handlePanLeave,
  } = usePan(offset, setOffset);

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const text = e.clipboardData.getData("text");
    if (!text) return;

    if (!isValidMakeCodeSprite(text)) return;

    try {
      const spriteData = parseMakeCodeSprite(text);
      pasteSpriteData(spriteData);
    } catch (error) {
      console.error("Failed to parse sprite data:", error);
    }
  };

  useEffect(() => initCanvas(), [initCanvas]);

  return (
    <div
      className="w-full min-h-full relative bg-[#1e1e1e] overflow-hidden"
      style={{
        cursor: tool === "pan" ? "grab" : "crosshair",
      }}
      onPaste={handlePaste}
      onMouseDown={handlePanDown}
      onMouseMove={handlePanMove}
      onMouseUp={handlePanUp}
      onMouseLeave={handlePanLeave}
      tabIndex={0}>
      <canvas
        ref={canvasRef}
        width={width * pixelSize}
        height={height * pixelSize}
        className="block absolute outline-none focus:outline-none active:outline-none hover:outline-none"
        tabIndex={0}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{
          left: offset.x,
          top: offset.y,
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
          imageRendering: "pixelated",
          outline: "none",
        }}
      />
      <ImportPreview />
      <SelectionOverlay />
    </div>
  );
});

Canvas.displayName = "Canvas";

export default Canvas;
