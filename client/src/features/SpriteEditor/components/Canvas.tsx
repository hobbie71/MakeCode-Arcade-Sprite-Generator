import { useEffect, memo, useState, useRef } from "react";

// Context import
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useToolSelected } from "../contexts/ToolSelectedContext/useToolSelected";
import { useZoom } from "../contexts/ZoomContext/useZoom";
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";

// Utility imports
import {
  isValidMakeCodeSprite,
  parseMakeCodeSprite,
} from "../../../utils/makeCodeSpriteValidation";

// Hook import
import { useSpriteEditorCanvas } from "../hooks/useSpriteEditorCanvas";
import { useMouseHandler } from "../hooks/useMouseHandler";
import { usePan } from "../hooks/usePan";
import { usePasteData } from "../hooks/usePasteData";

// Component imports
import SelectionOverlay from "./SelectionOverlay";
import ImportPreview from "./ImportPreview";

// Const imports
import { PIXEL_SIZE } from "../constants/canvas";

interface Props {
  width: number;
  height: number;
  pixelSize?: number;
}

const Canvas = memo(({ pixelSize = PIXEL_SIZE }: Props) => {
  // Context
  const { canvasRef } = useCanvas();
  const { tool } = useToolSelected();
  const { zoom } = useZoom();
  const { width, height } = useCanvasSize();

  // States
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
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

  // Init Canvas and center canvas in screen
  useEffect(() => {
    // Init Canvas
    initCanvas();

    // Center Canvas
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setOffset({ x: centerX, y: centerY });
  }, [initCanvas]);

  return (
    <div
      className="canvas-container"
      ref={containerRef}
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
        className="absolute"
        tabIndex={0}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{
          transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          position: "absolute",
          transformOrigin: "50% 50%",
          outline: "none",
        }}
      />
      <ImportPreview />
      <SelectionOverlay />
    </div>
  );
});

export default Canvas;
