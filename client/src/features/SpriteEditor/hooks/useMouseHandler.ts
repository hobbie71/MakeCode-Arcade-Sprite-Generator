import { useCallback, useMemo, useRef, useEffect } from "react";

// Type imports
import type { Coordinates } from "../../../types/pixel";

// Context imports
import { useMouseCoordinates } from "../contexts/MouseCoordinatesContext/useMouseCoordinates";
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { useZoom } from "../contexts/ZoomContext/useZoom";
import { getCanvasCoordinates } from "../libs/getCanvasCoordinates";
import { useToolSelected } from "../contexts/ToolSelectedContext/useToolSelected";

// Hook imports
import { usePencil } from "./usePencil";
import { useEraser } from "./useEraser";
import { useFill } from "./useFill";
import { useEyedropper } from "./useEyedropper";
import { useLine } from "./useLine";
import { useRectangle } from "./useRectangle";
import { useCircle } from "./useCircle";
import { useSelectTool } from "./useSelectTool";
import { EditorTools } from "../../../types/tools";
import { useCanvasPreview } from "./useCanvasPreview";
import { MakeCodeColor } from "../../../types/color";

export const useMouseHandler = () => {
  const { mouseCoordinates, setMouseCoordinates } = useMouseCoordinates();
  const { canvasRef } = useCanvas();
  const { zoom } = useZoom();
  const { tool } = useToolSelected();
  const { drawDotPreview, clearPreview } = useCanvasPreview();
  const { width: canvasWidth, height: canvasHeight } = useCanvasSize();

  const isMouseDownRef = useRef<boolean>(false);
  const isDrawing = useRef<boolean>(false);
  const startCoordinates = useRef<Coordinates | null>(null);
  // Keep track of last in-bounds coordinates without triggering renders
  const lastCoordinatesRef = useRef<Coordinates | null>(null);

  const {
    handlePointerDown: handlePencilDown,
    handlePointerMove: handlePencilMove,
    handlePointerUp: handlePencilUp,
  } = usePencil();
  const {
    handlePointerDown: handleEraserDown,
    handlePointerMove: handleEraserMove,
    handlePointerUp: handleEraserUp,
  } = useEraser();
  const { handlePointerDown: handleFillDown } = useFill();
  const { handlePointerDown: handleEyedropperDown } = useEyedropper();
  const {
    handlePointerDown: handleLineDown,
    handlePointerMove: handleLineMove,
    handlePointerUp: handleLineUp,
  } = useLine();
  const {
    handlePointerDown: handleRectangleDown,
    handlePointerMove: handleRectangleMove,
    handlePointerUp: handleRectangleUp,
  } = useRectangle();
  const {
    handlePointerDown: handleCircleDown,
    handlePointerMove: handleCircleMove,
    handlePointerUp: handleCircleUp,
  } = useCircle();
  const { handlePointerDown: handleSelectDown, updateHoverCursor } =
    useSelectTool();

  // Per-tool gesture dispatch. Select and Pan are absent on purpose: Select
  // runs its whole gesture on window listeners, Pan never draws.
  const downHandlerByTool = useMemo<
    Partial<Record<EditorTools, (coordinates: Coordinates) => void>>
  >(
    () => ({
      [EditorTools.Pencil]: handlePencilDown,
      [EditorTools.Eraser]: handleEraserDown,
      [EditorTools.Fill]: handleFillDown,
      [EditorTools.Eyedropper]: handleEyedropperDown,
      [EditorTools.Line]: handleLineDown,
      [EditorTools.Rectangle]: handleRectangleDown,
      [EditorTools.Circle]: handleCircleDown,
    }),
    [
      handlePencilDown,
      handleEraserDown,
      handleFillDown,
      handleEyedropperDown,
      handleLineDown,
      handleRectangleDown,
      handleCircleDown,
    ]
  );

  const moveHandlerByTool = useMemo<
    Partial<Record<EditorTools, (coordinates: Coordinates) => void>>
  >(
    () => ({
      [EditorTools.Pencil]: handlePencilMove,
      [EditorTools.Eraser]: handleEraserMove,
      [EditorTools.Line]: handleLineMove,
      [EditorTools.Rectangle]: handleRectangleMove,
      [EditorTools.Circle]: handleCircleMove,
    }),
    [
      handlePencilMove,
      handleEraserMove,
      handleLineMove,
      handleRectangleMove,
      handleCircleMove,
    ]
  );

  // Shape tools only commit when released in bounds; pencil/eraser commit
  // whatever was already drawn, so their up handlers take no coordinates.
  const shapeUpHandlerByTool = useMemo<
    Partial<Record<EditorTools, (coordinates: Coordinates) => void>>
  >(
    () => ({
      [EditorTools.Line]: handleLineUp,
      [EditorTools.Rectangle]: handleRectangleUp,
      [EditorTools.Circle]: handleCircleUp,
    }),
    [handleLineUp, handleRectangleUp, handleCircleUp]
  );

  // Helper to ensure we ignore coordinates that fall outside the sprite bounds
  const isInsideBounds = useCallback(
    (c: Coordinates) =>
      c.x >= 0 && c.y >= 0 && c.x < canvasWidth && c.y < canvasHeight,
    [canvasWidth, canvasHeight]
  );

  const updateMousePosition = useCallback(
    (newCoordinates: Coordinates) => {
      lastCoordinatesRef.current = newCoordinates;
      if (mouseCoordinates === null) {
        setMouseCoordinates(newCoordinates);
        return;
      }
      if (
        newCoordinates.x === mouseCoordinates.x &&
        newCoordinates.y === mouseCoordinates.y
      )
        return;
      setMouseCoordinates(newCoordinates);
    },
    [mouseCoordinates, setMouseCoordinates]
  );

  // Null when the canvas is unmounted — callers bail without touching state.
  const getEventCoordinates = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>): Coordinates | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      return getCanvasCoordinates(canvas, e, zoom);
    },
    [canvasRef, zoom]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Select owns its whole gesture via window listeners (drags must keep
      // tracking outside the sprite) — don't enter the canvas-element flow.
      if (tool === EditorTools.Select) {
        handleSelectDown(e);
        return;
      }

      isMouseDownRef.current = true;
      isDrawing.current = true;
      clearPreview();

      const coordinates = getCanvasCoordinates(canvas, e, zoom);
      startCoordinates.current = coordinates;
      downHandlerByTool[tool]?.(coordinates);
    },
    [canvasRef, zoom, tool, downHandlerByTool, handleSelectDown, clearPreview]
  );

  // Finalize drawing (used by normal mouseUp and global mouseup outside canvas)
  const finalizeDrawing = useCallback(
    (coordinates: Coordinates | null) => {
      isMouseDownRef.current = false;
      isDrawing.current = false;
      startCoordinates.current = null;

      if (tool === EditorTools.Pencil) {
        handlePencilUp();
        return;
      }
      if (tool === EditorTools.Eraser) {
        handleEraserUp();
        return;
      }

      const shapeUp = shapeUpHandlerByTool[tool];
      if (shapeUp && coordinates && isInsideBounds(coordinates)) {
        shapeUp(coordinates);
      }
    },
    [tool, handlePencilUp, handleEraserUp, shapeUpHandlerByTool, isInsideBounds]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const coordinates = getEventCoordinates(e);
      if (!coordinates) return;

      finalizeDrawing(coordinates);
    },
    [getEventCoordinates, finalizeDrawing]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const coordinates = getEventCoordinates(e);
      if (!coordinates) return;

      // Ignore moves outside the logical pixel grid to avoid drawing glitches
      if (!isInsideBounds(coordinates)) {
        return;
      }

      // Do nothing if coordinates haven't changed
      if (
        coordinates.x === mouseCoordinates?.x &&
        coordinates.y === mouseCoordinates?.y
      ) {
        return;
      }

      // Select draws no dot preview; hovering only updates cursor feedback
      // (move over the selection, crosshair elsewhere). Gestures themselves
      // run on window listeners owned by useSelectTool.
      if (tool === EditorTools.Select) {
        updateHoverCursor(e);
        updateMousePosition(coordinates);
        return;
      }

      // Draw dot preview if Left Mouse Button not down AND the tool paints a
      // pixel on press. Fill, Eyedropper and Pan don't, so a colored preview dot
      // would be misleading. (Select already returned above.)
      if (
        !isMouseDownRef.current &&
        !isDrawing.current &&
        tool !== EditorTools.Fill &&
        tool !== EditorTools.Eyedropper &&
        tool !== EditorTools.Pan
      ) {
        // if eraser draw clear preview
        if (tool === EditorTools.Eraser) {
          drawDotPreview(coordinates, MakeCodeColor.TRANSPARENT);
        } else {
          drawDotPreview(coordinates);
        }
        return;
      }

      updateMousePosition(coordinates);

      // Handle drawing/dragging
      moveHandlerByTool[tool]?.(coordinates);
    },
    [
      getEventCoordinates,
      tool,
      mouseCoordinates,
      drawDotPreview,
      updateMousePosition,
      updateHoverCursor,
      moveHandlerByTool,
      isInsideBounds,
    ]
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const coordinates = getEventCoordinates(e);
      if (!coordinates) return;
      updateMousePosition(coordinates);
    },
    [getEventCoordinates, updateMousePosition]
  );

  const handleMouseLeave = useCallback(() => {
    // If not actively drawing, clear everything. If drawing, keep the flags so we can resume on re-enter.
    if (!isMouseDownRef.current) {
      startCoordinates.current = null;
      setMouseCoordinates(null);
      lastCoordinatesRef.current = null;
    }
    clearPreview();
  }, [setMouseCoordinates, clearPreview]);

  // Attach a global mouseup to capture releases occurring outside the canvas
  // Stable global listener registered once; uses refs for latest state
  const finalizeDrawingRef = useRef(finalizeDrawing);
  useEffect(() => {
    finalizeDrawingRef.current = finalizeDrawing;
  }, [finalizeDrawing]);

  useEffect(() => {
    const handleWindowMouseUp = () => {
      if (!isMouseDownRef.current) return;
      finalizeDrawingRef.current(lastCoordinatesRef.current);
    };
    window.addEventListener("mouseup", handleWindowMouseUp);
    return () => window.removeEventListener("mouseup", handleWindowMouseUp);
  }, []);

  return {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  };
};
