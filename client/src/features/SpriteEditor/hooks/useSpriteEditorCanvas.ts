import { useCallback, useRef } from "react";

// Context imports
import { useCanvas } from "../contexts/CanvasContext/useCanvas";
import { useColorSelected } from "../contexts/ColorSelectedContext/useColorSelected";
import { useToolSelected } from "../contexts/ToolSelectedContext/useToolSelected";
import { useZoom } from "../contexts/ZoomContext/useZoom";
import { useSelectionArea } from "../contexts/SelectionArea/useSelectionArea";

// Hook imports
import { useSpriteData } from "./useSpriteData";
import { useSelectionOverlay } from "./useSelectionOverlay";

// Lib imports
import { getCanvasCoordinates } from "../libs/getCanvasCoordinates";
import {
  drawPixelOnCanvas,
  drawSpriteDataOnCanvas,
} from "../libs/drawPixelOnCanvas";
import { handleDraw } from "../libs/handleDraw";

// Type imports
import { MakeCodeColor } from "@/types/color";
import { EditorTools } from "@/types/tools";
import { Coordinates } from "@/types/pixel";

export const useSpriteEditorCanvas = (
  width: number,
  height: number,
  pixelSize: number
) => {
  // Hooks
  const { canvasRef } = useCanvas();
  const { color, palette } = useColorSelected();
  const { tool } = useToolSelected();
  const { zoom } = useZoom();
  const { initCanvasOnly, setSpriteDataCoordinates, commitSpriteData } =
    useSpriteData();
  const { setStartOverlay, setEndOverlay } = useSelectionOverlay();
  const { selectionArea, setSelectionArea } = useSelectionArea();

  // Refs
  const isPointerDown = useRef<boolean>(false);
  const lastPanPosition = useRef<Coordinates | null>(null);

  const handlePointerDown = useCallback(
    (e: React.MouseEvent) => {
      if (!canvasRef.current) return;
      isPointerDown.current = true;

      if (tool === EditorTools.Pan) {
        lastPanPosition.current = { x: e.clientX, y: e.clientY };
        return;
      }

      const coordinates = getCanvasCoordinates(
        canvasRef.current,
        e,
        pixelSize,
        zoom
      );

      if (tool === EditorTools.Select) {
        if (selectionArea) setSelectionArea(null);

        setStartOverlay(coordinates);
        return;
      }

      const actualColor = handleDraw(
        canvasRef.current,
        coordinates,
        color,
        palette,
        tool
      );

      setSpriteDataCoordinates(coordinates, actualColor);
    },
    [
      canvasRef,
      color,
      palette,
      pixelSize,
      tool,
      zoom,
      setSpriteDataCoordinates,
      setStartOverlay,
      selectionArea,
      setSelectionArea,
    ]
  );

  const handlePointerMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPointerDown.current || !canvasRef.current) return;

      const coordinates = getCanvasCoordinates(
        canvasRef.current,
        e,
        pixelSize,
        zoom
      );

      if (tool === EditorTools.Select) {
        setEndOverlay(coordinates);
        return;
      }

      const actualColor = handleDraw(
        canvasRef.current,
        coordinates,
        color,
        palette,
        tool
      );

      setSpriteDataCoordinates(coordinates, actualColor);
    },
    [
      canvasRef,
      color,
      palette,
      pixelSize,
      tool,
      zoom,
      setSpriteDataCoordinates,
      setEndOverlay,
    ]
  );

  const handlePointerUp = useCallback(() => {
    isPointerDown.current = false;
    lastPanPosition.current = null;

    commitSpriteData();
  }, [commitSpriteData]);

  const handlePointerLeave = useCallback(() => {
    isPointerDown.current = false;
    lastPanPosition.current = null;

    commitSpriteData();
  }, [commitSpriteData]);

  const pasteSpriteData = useCallback(
    (spriteData: MakeCodeColor[][]) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      drawSpriteDataOnCanvas(canvas, { x: 0, y: 0 }, spriteData);
      setStartOverlay({ x: 0, y: 0 });
      setEndOverlay({ x: spriteData[0].length, y: spriteData.length });
    },
    [canvasRef, setStartOverlay, setEndOverlay]
  );

  const initCanvas = useCallback(() => {
    if (!canvasRef.current) return;

    const currentData = initCanvasOnly();

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const color = currentData[y]
          ? currentData[y][x]
          : MakeCodeColor.TRANSPARENT;
        drawPixelOnCanvas(canvasRef.current, { x, y }, color);
      }
    }
  }, [canvasRef, height, width, initCanvasOnly]);

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerLeave,
    pasteSpriteData,
    initCanvas,
  };
};
