import { useEffect, memo, useState, useRef, useCallback } from "react";

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
import PreviewCanvas from "./PreviewCanvas";

// Const imports
import { PIXEL_SIZE, MAX_ZOOM, MIN_ZOOM } from "../constants/canvas";

interface Props {
  width: number;
  height: number;
  pixelSize?: number;
}

// Old canvas-container background color: bg-[#1e1e1e]

const Canvas = memo(({ pixelSize = PIXEL_SIZE }: Props) => {
  // Context
  const { canvasRef } = useCanvas();
  const { tool } = useToolSelected();
  const { zoom, setZoom } = useZoom();
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

  const centerCanvas = () => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setOffset({ x: centerX, y: centerY });
  };

  const getInitZoom = useCallback((): number => {
    const container = containerRef.current;
    if (!container) throw new Error("No container");

    const containerRect = container.getBoundingClientRect();

    // Calculate the actual canvas dimensions (in pixels)
    const canvasWidth = width * pixelSize;
    const canvasHeight = height * pixelSize;

    // Leave some padding around the canvas (10% of container size)
    const padding = 0.1;
    const availableWidth = containerRect.width * (1 - padding);
    const availableHeight = containerRect.height * (1 - padding);

    // Calculate zoom needed to fit both width and height
    const zoomX = availableWidth / canvasWidth;
    const zoomY = availableHeight / canvasHeight;

    // Use the smaller zoom to ensure canvas fits in both dimensions
    const optimalZoom = Math.min(zoomX, zoomY);

    // Clamp zoom within allowed limits
    const clampedZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, optimalZoom));
    return clampedZoom;
  }, [height, width, pixelSize]);

  // Init Canvas and center canvas in screen
  useEffect(() => {
    // Init Canvas
    initCanvas();

    // Center Canvas
    centerCanvas();

    const newZoom = getInitZoom();
    setZoom(newZoom);
  }, [initCanvas, getInitZoom, setZoom]);

  // effect: Center canvas on resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    centerCanvas();

    const handleResize = () => {
      centerCanvas();

      const newZoom = getInitZoom();
      setZoom(newZoom);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [getInitZoom, setZoom]);

  // effect: Auto-adjust zoom when canvas size changes
  useEffect(() => {
    const newZoom = getInitZoom();
    setZoom(newZoom);
  }, [width, height, setZoom, getInitZoom]);

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
      role="application"
      aria-label="Sprite Editor Canvas"
      tabIndex={0}>
      <canvas
        ref={canvasRef}
        width={width * pixelSize}
        height={height * pixelSize}
        className="absolute"
        tabIndex={-1}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        aria-label={`Sprite canvas ${width} by ${height} pixels, currently using ${tool} tool at ${Math.round(zoom * 100)}% zoom`}
        role="img"
        style={{
          transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          transformOrigin: "50% 50%",
          outline: "none",
        }}
      />
      <PreviewCanvas
        width={width}
        height={height}
        pixelSize={pixelSize}
        offset={offset}
        zoom={zoom}
      />
      <ImportPreview />
      <SelectionOverlay />
    </div>
  );
});

export default Canvas;
