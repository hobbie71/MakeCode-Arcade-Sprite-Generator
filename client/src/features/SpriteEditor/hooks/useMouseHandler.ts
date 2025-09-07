import { useCallback, useRef } from "react";

// Type imports
import type { Coordinates } from "../../../types/pixel";

// Context imports
import { useMouseCoordinates } from "../contexts/MouseCoordinatesContext/useMouseCoordinates";
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useZoom } from "../contexts/ZoomContext/useZoom";
import { getCanvasCoordinates } from "../libs/getCanvasCoordinates";
import { useToolSelected } from "../contexts/ToolSelectedContext/useToolSelected";

// Hook imports
import { usePencil } from "./usePencil";
import { useEraser } from "./useEraser";
import { useFill } from "./useFill";
import { useLine } from "./useLine";
// import { useRectangle } from "./useRectangle";
// import { useCircle } from "./useCircle";
// import { useSelect } from "./useSelect";
import { EditorTools } from "../../../types/tools";
import { useCanvasPreview } from "./useCanvasPreview";

export const useMouseHandler = () => {
  const { mouseCoordinates, setMouseCoordinates } = useMouseCoordinates();
  const { canvasRef } = useCanvas();
  const { zoom } = useZoom();
  const { tool } = useToolSelected();
  const { drawDotPreview, clearPreview } = useCanvasPreview();

  const isMouseDownRef = useRef<boolean>(false);
  const startCoordinates = useRef<Coordinates | null>(null);

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
  // const {
  //   handlePointerDown: handleRectangleDown,
  //   handlePointerMove: handleRectangleMove,
  //   handlePointerUp: handleRectangleUp,
  // } = useRectangle();
  // const {
  //   handlePointerDown: handleCircleDown,
  //   handlePointerMove: handleCircleMove,
  //   handlePointerUp: handleCircleUp,
  // } = useCircle();
  // const {
  //   handlePointerDown: handleSelectDown,
  //   handlePointerMove: handleSelectMove,
  //   handlePointerUp: handleSelectUp,
  // } = useSelect();

  const updateMousePosition = useCallback(
    (newCoordinates: Coordinates) => {
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
        // } else if (tool === EditorTools.Rectangle) {
        //   handleRectangleDown(coordinates);
        // } else if (tool === EditorTools.Circle) {
        //   handleCircleDown(coordinates);
        // } else if (tool === EditorTools.Select) {
        //   handleSelectDown(coordinates);
      } else if (tool === EditorTools.Pan) {
        // Do nothing for Pan
      } else {
        // Default case, do nothing
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
      // handleRectangleDown,
      // handleCircleDown,
      // handleSelectDown,
    ]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      isMouseDownRef.current = false;
      startCoordinates.current = null;

      const coordinates = getCanvasCoordinates(canvas, e, zoom);

      if (tool === EditorTools.Pencil) {
        handlePencilUp();
      } else if (tool === EditorTools.Eraser) {
        handleEraserUp();
      } else if (tool === EditorTools.Line) {
        handleLineUp(coordinates);
      } else if (tool === EditorTools.Rectangle) {
        //   handleRectangleUp(coordinates);
        // } else if (tool === EditorTools.Circle) {
        //   handleCircleUp(coordinates);
        // } else if (tool === EditorTools.Select) {
        //   handleSelectUp(coordinates);
      } else if (tool === EditorTools.Pan) {
        // Do nothing for Pan
      } else {
        // Default case, do nothing
      }
    },
    [
      canvasRef,
      zoom,
      tool,
      handlePencilUp,
      handleEraserUp,
      handleLineUp,
      // handleRectangleUp,
      // handleCircleUp,
      // handleSelectUp,
    ]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const coordinates = getCanvasCoordinates(canvas, e, zoom);

      // Do nothing if coordinates haven't changed
      if (
        coordinates.x === mouseCoordinates?.x &&
        coordinates.y === mouseCoordinates.y
      ) {
        return;
      }

      // Draw dot preview if Left Mouse Button not down
      if (!isMouseDownRef.current) {
        drawDotPreview(coordinates);
        return;
      }

      updateMousePosition(coordinates);

      // Handle drawing/dragging
      if (tool === EditorTools.Pencil) {
        handlePencilMove(coordinates);
      } else if (tool === EditorTools.Eraser) {
        handleEraserMove(coordinates);
      }
      if (tool === EditorTools.Line) {
        handleLineMove(coordinates);
        // } else if (tool === EditorTools.Rectangle) {
        //   handleRectangleMove(coordinates);
        // } else if (tool === EditorTools.Circle) {
        //   handleCircleMove(coordinates);
        // }
        // } else if (tool === EditorTools.Select) {
        //   handleSelectMove(coordinates);
      } else if (tool === EditorTools.Pan) {
        // Do nothing for Pan
      } else {
        // Default case, do nothing
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
      // handleRectangleMove,
      // handleCircleMove,
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
    isMouseDownRef.current = false;
    startCoordinates.current = null;
    setMouseCoordinates(null);
    clearPreview();
  }, [setMouseCoordinates, clearPreview]);

  return {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  };
};
