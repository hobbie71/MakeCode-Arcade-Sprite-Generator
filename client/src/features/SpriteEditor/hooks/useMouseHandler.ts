import { useCallback, useRef } from "react";

// Type imports
import { Coordinates } from "@/types/pixel";

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
// import { useLine } from "./useLine";
// import { useRectangle } from "./useRectangle";
// import { useCircle } from "./useCircle";
// import { useSelect } from "./useSelect";
import { EditorTools } from "@/types/tools";

export const useMouseHandler = () => {
  const { mouseCoordinates, setMouseCoordinates } = useMouseCoordinates();
  const { canvasRef } = useCanvas();
  const { zoom } = useZoom();
  const { tool } = useToolSelected();

  const isMouseDown = useRef<boolean>(false);

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
  // const {
  //   handlePointerDown: handleLineDown,
  //   handlePointerMove: handleLineMove,
  //   handlePointerUp: handleLineUp,
  // } = useLine();
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

      isMouseDown.current = true;

      const coordinates = getCanvasCoordinates(canvas, e, zoom);

      switch (tool) {
        case EditorTools.Pencil:
          handlePencilDown(coordinates);
          break;
        case EditorTools.Eraser:
          handleEraserDown(coordinates);
          break;
        case EditorTools.Fill:
          handleFillDown(coordinates);
          break;
        // case EditorTools.Line:
        //   handleLineDown(coordinates);
        //   break;
        // case EditorTools.Rectangle:
        //   handleRectangleDown(coordinates);
        //   break;
        // case EditorTools.Circle:
        //   handleCircleDown(coordinates);
        //   break;
        // case EditorTools.Select:
        //   handleSelectDown(coordinates);
        //   break;
        case EditorTools.Pan:
          break;
        default:
          break;
      }
    },
    [
      canvasRef,
      zoom,
      tool,
      handlePencilDown,
      handleEraserDown,
      handleFillDown,
      // handleLineDown,
      // handleRectangleDown,
      // handleCircleDown,
      // handleSelectDown,
    ]
  );

  const handleMouseUp = useCallback(() =>
    // e: React.MouseEvent<HTMLCanvasElement>
    {
      const canvas = canvasRef.current;
      if (!canvas) return;

      isMouseDown.current = false;

      // const coordinates = getCanvasCoordinates(canvas, e, zoom);

      switch (tool) {
        case EditorTools.Pencil:
          handlePencilUp();
          break;
        case EditorTools.Eraser:
          handleEraserUp();
          break;
        case EditorTools.Fill:
          break;
        // case EditorTools.Line:
        //   handleLineUp(coordinates);
        //   break;
        // case EditorTools.Rectangle:
        //   handleRectangleUp(coordinates);
        //   break;
        // case EditorTools.Circle:
        //   handleCircleUp(coordinates);
        //   break;
        // case EditorTools.Select:
        //   handleSelectUp(coordinates);
        //   break;
        case EditorTools.Pan:
          break;
        default:
          break;
      }
    }, [
    canvasRef,
    // zoom,
    tool,
    handlePencilUp,
    handleEraserUp,
    // handleLineUp,
    // handleRectangleUp,
    // handleCircleUp,
    // handleSelectUp,
  ]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isMouseDown.current) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const coordinates = getCanvasCoordinates(canvas, e, zoom);
      updateMousePosition(coordinates);

      switch (tool) {
        case EditorTools.Pencil:
          handlePencilMove(coordinates);
          break;
        case EditorTools.Eraser:
          handleEraserMove(coordinates);
          break;
        case EditorTools.Fill:
          break;
        // case EditorTools.Line:
        //   handleLineMove(coordinates);
        //   break;
        // case EditorTools.Rectangle:
        //   handleRectangleMove(coordinates);
        //   break;
        // case EditorTools.Circle:
        //   handleCircleMove(coordinates);
        //   break;
        // case EditorTools.Select:
        //   handleSelectMove(coordinates);
        //   break;
        case EditorTools.Pan:
          break;
        default:
          break;
      }
    },
    [
      canvasRef,
      zoom,
      tool,
      updateMousePosition,
      handlePencilMove,
      handleEraserMove,
      // handleLineMove,
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
    isMouseDown.current = false;
    setMouseCoordinates(null);
  }, [setMouseCoordinates]);

  return {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  };
};
