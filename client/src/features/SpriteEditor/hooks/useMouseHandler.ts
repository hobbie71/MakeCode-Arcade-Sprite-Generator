import { useCallback, useRef, useEffect } from "react";

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
import { useLine } from "./useLine";
import { useRectangle } from "./useRectangle";
import { useCircle } from "./useCircle";
// import { useSelect } from "./useSelect";
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
  // const {
  //   handlePointerDown: handleSelectDown,
  //   handlePointerMove: handleSelectMove,
  //   handlePointerUp: handleSelectUp,
  // } = useSelect();

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

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      isMouseDownRef.current = true;
      isDrawing.current = true;

      const coordinates = getCanvasCoordinates(canvas, e, zoom);
      startCoordinates.current = coordinates;
      if (tool === EditorTools.Pencil) {
        handlePencilDown(coordinates);
      } else if (tool === EditorTools.Eraser) {
        handleEraserDown(coordinates);
      } else if (tool === EditorTools.Fill) {
        handleFillDown(coordinates);
      } else if (tool === EditorTools.Line) {
        handleLineDown(coordinates);
      } else if (tool === EditorTools.Rectangle) {
        handleRectangleDown(coordinates);
      } else if (tool === EditorTools.Circle) {
        handleCircleDown(coordinates);
      } else if (tool === EditorTools.Select) {
        //   handleSelectDown(coordinates);
      }
    },
    [
      canvasRef,
      zoom,
      tool,
      handlePencilDown,
      handleEraserDown,
      handleFillDown,
      handleLineDown,
      handleRectangleDown,
      handleCircleDown,
      // handleSelectDown,
    ]
  );

  // Finalize drawing (used by normal mouseUp and global mouseup outside canvas)
  const finalizeDrawing = useCallback(
    (coordinates: Coordinates | null) => {
      isMouseDownRef.current = false;
      isDrawing.current = false;
      startCoordinates.current = null;

      if (tool === EditorTools.Pencil) {
        handlePencilUp();
      } else if (tool === EditorTools.Eraser) {
        handleEraserUp();
      } else if (tool === EditorTools.Line) {
        if (coordinates && isInsideBounds(coordinates))
          handleLineUp(coordinates);
      } else if (tool === EditorTools.Rectangle) {
        if (coordinates && isInsideBounds(coordinates))
          handleRectangleUp(coordinates);
      } else if (tool === EditorTools.Circle) {
        if (coordinates && isInsideBounds(coordinates))
          handleCircleUp(coordinates);
      } else if (tool === EditorTools.Select) {
        // handleSelectUp(coordinates);
      }
    },
    [
      tool,
      handlePencilUp,
      handleEraserUp,
      handleLineUp,
      handleRectangleUp,
      handleCircleUp,
      isInsideBounds,
    ]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const coordinates = getCanvasCoordinates(canvas, e, zoom);
      finalizeDrawing(coordinates);
    },
    [canvasRef, zoom, finalizeDrawing]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const coordinates = getCanvasCoordinates(canvas, e, zoom);

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

      // Draw dot preview if Left Mouse Button not down AND tool is not fill
      if (
        !isMouseDownRef.current &&
        !isDrawing.current &&
        tool !== EditorTools.Fill
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
      if (tool === EditorTools.Pencil) {
        handlePencilMove(coordinates);
      } else if (tool === EditorTools.Eraser) {
        handleEraserMove(coordinates);
      } else if (tool === EditorTools.Line) {
        handleLineMove(coordinates);
      } else if (tool === EditorTools.Rectangle) {
        handleRectangleMove(coordinates);
      } else if (tool === EditorTools.Circle) {
        handleCircleMove(coordinates);
      } else if (tool === EditorTools.Select) {
        // handleSelectMove(coordinates);
      }
    },
    [
      canvasRef,
      zoom,
      tool,
      mouseCoordinates,
      drawDotPreview,
      updateMousePosition,
      handlePencilMove,
      handleEraserMove,
      handleLineMove,
      handleRectangleMove,
      handleCircleMove,
      isInsideBounds,
      // handleSelectMove,
    ]
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const coordinates = getCanvasCoordinates(canvas, e, zoom);
      updateMousePosition(coordinates);
    },
    [canvasRef, zoom, updateMousePosition]
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
