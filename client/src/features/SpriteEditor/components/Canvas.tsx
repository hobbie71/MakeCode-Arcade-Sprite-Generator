import { useEffect, memo, useState, useRef, useCallback } from "react";

// Context import
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useToolSelected } from "../contexts/ToolSelectedContext/useToolSelected";
import { useZoom } from "../contexts/ZoomContext/useZoom";
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { useSprite } from "../../../context/SpriteContext/useSprite";
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";

// Utility imports
import {
  isValidMakeCodeSprite,
  parseMakeCodeSprite,
} from "../../../utils/makeCodeSpriteValidation";

// Hook import
import { useSpriteEditorCanvas } from "../hooks/useSpriteEditorCanvas";
import { useMouseHandler } from "../hooks/useMouseHandler";
import { usePan } from "../hooks/usePan";
import { useSelectTool } from "../hooks/useSelectTool";
import { useSelection } from "../contexts/SelectionContext/useSelection";

// Component imports
import SelectionAntsOverlay from "./SelectionAntsOverlay";
import FloatingSelectionCanvas from "./FloatingSelectionCanvas";
import SourceOverlay from "./SourceOverlay";
import PreviewCanvas from "./PreviewCanvas";
import GridOverlay from "./GridOverlay";

// Const imports
import {
  PIXEL_SIZE,
  MAX_ZOOM,
  MIN_ZOOM,
  FIT_BOTTOM_GAP,
  FIT_BOTTOM_FALLBACK,
} from "../constants/canvas";
import { EditorTools } from "../../../types/tools";

// Lib imports
import { computeStageFit } from "../libs/canvasFit";

interface Props {
  pixelSize?: number;
}

// Old canvas-container background color: bg-[#1e1e1e]

const Canvas = memo(({ pixelSize = PIXEL_SIZE }: Props) => {
  // Context
  const { canvasRef } = useCanvas();
  const { tool, setTool } = useToolSelected();
  const { zoom, setZoom, registerFitToScreen } = useZoom();
  const { width, height } = useCanvasSize();
  const { spriteData } = useSprite();
  const { palette } = usePaletteSelected();
  const { pasteAsFloating } = useSelection();

  // States
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const { initCanvas, redrawCanvas } = useSpriteEditorCanvas(width, height);

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

  const { handlePointerDown: handleSelectDown } = useSelectTool();

  // Select-tool presses on the stage (not the sprite canvas itself) still go
  // to the select gesture handler: clicking empty stage deselects, and resize
  // handles hanging past the sprite border stay grabbable. Presses on the
  // canvas already reach it through useMouseHandler — skip those to avoid
  // double-dispatch (the canvas mousedown bubbles up to this container).
  const handleContainerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    handlePanDown(e);
    if (tool === "select" && e.target !== canvasRef.current) {
      handleSelectDown(e);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const text = e.clipboardData.getData("text");
    if (!text) return;

    if (!isValidMakeCodeSprite(text)) return;

    try {
      const parsed = parseMakeCodeSprite(text);
      // Paste becomes a floating selection (move it, then commit) rather than
      // replacing the canvas — ADR-0007. Force Select so it's interactable.
      if (tool !== EditorTools.Select) setTool(EditorTools.Select);
      pasteAsFloating(parsed, text);
    } catch (error) {
      console.error("Failed to parse sprite data:", error);
    }
  };

  // Measure the stage and how much of it the floating bottom action bar covers.
  // The bar is a fixed pixel height (and sits higher on small screens), so we
  // reserve its MEASURED size: a flat percentage clears it on tall viewports but
  // lets the canvas slide behind it on short ones. Falls back to a constant if
  // the bar isn't in the DOM.
  const measureStage = useCallback(() => {
    const container = containerRef.current;
    if (!container) return null;
    const rect = container.getBoundingClientRect();
    const bar = document.querySelector<HTMLElement>(
      "[data-fit-obstacle='bottom']"
    );
    const bottomInset = bar
      ? Math.max(0, rect.bottom - bar.getBoundingClientRect().top) +
        FIT_BOTTOM_GAP
      : FIT_BOTTOM_FALLBACK;
    return { rect, bottomInset };
  }, []);

  // Zoom + center offset that fit the sprite in the clear area above the bar.
  const getStageFit = useCallback(() => {
    const stage = measureStage();
    if (!stage) return null;
    return computeStageFit(
      stage.rect.width,
      stage.rect.height,
      stage.bottomInset,
      width * pixelSize,
      height * pixelSize
    );
  }, [measureStage, width, height, pixelSize]);

  const centerCanvas = useCallback(() => {
    const fit = getStageFit();
    if (fit) setOffset(fit.offset);
  }, [getStageFit]);

  const getInitZoom = useCallback((): number => {
    const fit = getStageFit();
    if (!fit) throw new Error("No container");
    return fit.zoom;
  }, [getStageFit]);

  // Fit the canvas to the stage and re-center it. Exposed through ZoomContext so
  // the zoom menu can trigger it without owning the container/offset state.
  const fitToScreen = useCallback(() => {
    const fit = getStageFit();
    if (!fit) return;
    setOffset(fit.offset);
    setZoom(fit.zoom);
  }, [getStageFit, setZoom]);

  useEffect(() => {
    registerFitToScreen(fitToScreen);
    return () => registerFitToScreen(() => {});
  }, [registerFitToScreen, fitToScreen]);

  // Init Canvas and center canvas in screen
  useEffect(() => {
    // Init Canvas
    initCanvas();

    // Center Canvas
    centerCanvas();

    const newZoom = getInitZoom();
    setZoom(newZoom);
  }, [initCanvas, centerCanvas, getInitZoom, setZoom]);

  // Repaint when the committed sprite data or palette changes. Tools paint
  // imperatively during a drag and only update spriteData on commit, so this fires
  // after each committed edit (and on undo/redo, paste, and palette swap). The grid
  // is no longer painted here — it lives in GridOverlay, which tracks zoom/offset.
  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas, spriteData, palette]);

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
  }, [centerCanvas, getInitZoom, setZoom]);

  // effect: Auto-adjust zoom when canvas size changes
  useEffect(() => {
    const newZoom = getInitZoom();
    setZoom(newZoom);
  }, [width, height, setZoom, getInitZoom]);

  // effect: trackpad/wheel input. Plain scrolling pans the stage in any direction;
  // a pinch gesture (which the browser delivers as a wheel event with ctrlKey set)
  // zooms, centered on the stage. Non-passive native listener so we can
  // preventDefault and stop the page from scrolling/zooming underneath (React 19's
  // onWheel is passive by default).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey) {
        // Pinch-to-zoom. Cap the per-event delta so a real mouse wheel held with
        // Ctrl doesn't jump zoom levels; trackpad pinches send small deltas.
        const delta = Math.max(-30, Math.min(30, e.deltaY));
        setZoom((z) =>
          Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z * (1 - delta * 0.01)))
        );
      } else {
        // Two-finger scroll pans the canvas (up/down and left/right).
        setOffset((o) => ({ x: o.x - e.deltaX, y: o.y - e.deltaY }));
      }
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [setZoom]);

  return (
    <div
      className="canvas-container"
      ref={containerRef}
      style={{
        cursor: tool === "pan" ? "grab" : "crosshair",
      }}
      onPaste={handlePaste}
      onMouseDown={handleContainerMouseDown}
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
          imageRendering: "pixelated",
        }}
      />
      <SourceOverlay
        width={width}
        height={height}
        pixelSize={pixelSize}
        offset={offset}
        zoom={zoom}
      />
      <GridOverlay
        width={width}
        height={height}
        pixelSize={pixelSize}
        offset={offset}
        zoom={zoom}
      />
      <PreviewCanvas
        width={width}
        height={height}
        pixelSize={pixelSize}
        offset={offset}
        zoom={zoom}
      />
      <FloatingSelectionCanvas
        width={width}
        height={height}
        pixelSize={pixelSize}
        offset={offset}
        zoom={zoom}
      />
      <SelectionAntsOverlay
        width={width}
        height={height}
        pixelSize={pixelSize}
        offset={offset}
        zoom={zoom}
      />
    </div>
  );
});

export default Canvas;
