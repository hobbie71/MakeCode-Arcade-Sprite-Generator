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

// Tools that paint nothing on hover: Fill/Eyedropper act on click, Pan moves the
// view. Select is handled earlier (it shows a cursor, not a dot). Everything else
// previews the pixel under the pointer.
const NO_DOT_PREVIEW_TOOLS = new Set<EditorTools>([
  EditorTools.Fill,
  EditorTools.Eyedropper,
  EditorTools.Pan,
]);

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
    (e: React.PointerEvent<HTMLCanvasElement>): Coordinates | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      return getCanvasCoordinates(canvas, e, zoom);
    },
    [canvasRef, zoom]
  );

  // Route a press / drag to the active tool, no-op for tools without a handler.
  const dispatchDown = useCallback(
    (coordinates: Coordinates) => downHandlerByTool[tool]?.(coordinates),
    [downHandlerByTool, tool]
  );
  const dispatchMove = useCallback(
    (coordinates: Coordinates) => moveHandlerByTool[tool]?.(coordinates),
    [moveHandlerByTool, tool]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Ignore secondary touch points (a second finger resting on the canvas):
      // only the primary pointer drives a stroke, so a stray finger can't fork
      // the line between two contact points. (A touch pointer is implicitly
      // captured by its target on press, so a drag off the canvas edge and back
      // keeps streaming moves here; the window-level finalize below covers the
      // mouse case where there is no implicit capture.)
      if (e.isPrimary === false) return;

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
      dispatchDown(coordinates);
    },
    [canvasRef, zoom, tool, dispatchDown, handleSelectDown, clearPreview]
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

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.isPrimary === false) return;
      const coordinates = getEventCoordinates(e);
      if (!coordinates) return;

      finalizeDrawing(coordinates);
    },
    [getEventCoordinates, finalizeDrawing]
  );

  // A move only acts on the primary pointer inside the logical pixel grid;
  // returns null to bail (off-canvas, unmounted, or out of bounds — which would
  // otherwise cause drawing glitches).
  const getInBoundsCoordinates = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>): Coordinates | null => {
      if (e.isPrimary === false) return null;
      const coordinates = getEventCoordinates(e);
      if (!coordinates || !isInsideBounds(coordinates)) return null;
      return coordinates;
    },
    [getEventCoordinates, isInsideBounds]
  );

  // The pointer was already reported at these coordinates, so a repeat move is
  // a no-op (avoids redundant state churn and re-dispatch).
  const isSameAsLast = useCallback(
    (c: Coordinates) => {
      const last = mouseCoordinates;
      return last !== null && c.x === last.x && c.y === last.y;
    },
    [mouseCoordinates]
  );

  // Hovering (not actively drawing) over a painting tool previews the pixel under
  // the pointer. The no-preview tools leave the canvas untouched, and a held
  // button means we're drawing, not hovering.
  const isHoverIdle = useCallback(
    () =>
      !isMouseDownRef.current &&
      !isDrawing.current &&
      !NO_DOT_PREVIEW_TOOLS.has(tool),
    [tool]
  );

  const drawHoverPreview = useCallback(
    (coordinates: Coordinates) => {
      // Eraser previews as the transparent "no pixel" colour.
      if (tool === EditorTools.Eraser) {
        drawDotPreview(coordinates, MakeCodeColor.TRANSPARENT);
        return;
      }
      drawDotPreview(coordinates);
    },
    [tool, drawDotPreview]
  );

  // Hover feedback that runs before any drawing dispatch. Returns true when it
  // owns the move (Select cursor feedback, or a painting tool's preview dot).
  const handleHover = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>, coordinates: Coordinates) => {
      // Select draws no dot preview; hovering only updates cursor feedback (move
      // over the selection, crosshair elsewhere). Gestures themselves run on
      // window listeners owned by useSelectTool.
      if (tool === EditorTools.Select) {
        updateHoverCursor(e);
        updateMousePosition(coordinates);
        return true;
      }
      if (isHoverIdle()) {
        drawHoverPreview(coordinates);
        return true;
      }
      return false;
    },
    [tool, updateHoverCursor, updateMousePosition, isHoverIdle, drawHoverPreview]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const coordinates = getInBoundsCoordinates(e);
      if (!coordinates) return;
      if (isSameAsLast(coordinates)) return;
      // Hover feedback consumes the move when we're not actively drawing.
      if (handleHover(e, coordinates)) return;

      updateMousePosition(coordinates);
      dispatchMove(coordinates);
    },
    [
      getInBoundsCoordinates,
      isSameAsLast,
      handleHover,
      updateMousePosition,
      dispatchMove,
    ]
  );

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const coordinates = getEventCoordinates(e);
      if (!coordinates) return;
      updateMousePosition(coordinates);
    },
    [getEventCoordinates, updateMousePosition]
  );

  const handlePointerLeave = useCallback(() => {
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
    const handleWindowPointerUp = (e: PointerEvent) => {
      if (e.isPrimary === false) return;
      if (!isMouseDownRef.current) return;
      finalizeDrawingRef.current(lastCoordinatesRef.current);
    };
    window.addEventListener("pointerup", handleWindowPointerUp);
    return () => window.removeEventListener("pointerup", handleWindowPointerUp);
  }, []);

  return {
    handlePointerDown,
    handlePointerUp,
    handlePointerMove,
    handlePointerEnter,
    handlePointerLeave,
  };
};
