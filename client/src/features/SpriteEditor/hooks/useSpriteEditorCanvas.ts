import { useCallback, useRef } from "react";

// Context imports
import { useCanvas } from "../contexts/CanvasContext/useCanvas";
import { useColorSelected } from "../contexts/ColorSelectedContext/useColorSelected";
import { useToolSelected } from "../contexts/ToolSelectedContext/useToolSelected";
import { useZoom } from "../contexts/ZoomContext/useZoom";

// Hook imports
import { useSpriteData } from "./useSpriteData";

// Lib imports
import { getCanvasCoordinates } from "../libs/getCanvasCoordinates";
import { drawPixelOnCanvas } from "../libs/drawPixelOnCanvas";
import { handleDraw } from "../libs/handleDraw";

// Type imports
import { MakeCodeColor } from "@/types/color";
import { EditorTools } from "@/types/tools";
import { Coordinates } from "@/types/pixel";

export const useSpriteEditorCanvas = (
  width: number,
  height: number,
  pixelSize: number,
  offset: Coordinates,
  setOffset: (offset: Coordinates) => void
) => {
  // Hooks
  const { canvasRef } = useCanvas();
  const { color, palette } = useColorSelected();
  const { tool } = useToolSelected();
  const { zoom } = useZoom();
  const { initSpriteData, updateSpriteData } = useSpriteData();

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
      handleDraw(canvasRef.current, coordinates, color, palette, tool);

      updateSpriteData(coordinates, color);
    },
    [canvasRef, color, palette, pixelSize, tool, zoom, updateSpriteData]
  );

  const handlePointerMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPointerDown.current || !canvasRef.current) return;

      if (tool === EditorTools.Pan && lastPanPosition.current) {
        const dx = e.clientX - lastPanPosition.current.x;
        const dy = e.clientY - lastPanPosition.current.y;
        setOffset({ x: offset.x + dx, y: offset.y + dy });
        lastPanPosition.current = { x: e.clientX, y: e.clientY };
        return;
      }

      const coordinates = getCanvasCoordinates(
        canvasRef.current,
        e,
        pixelSize,
        zoom
      );
      handleDraw(canvasRef.current, coordinates, color, palette, tool);

      updateSpriteData(coordinates, color);
    },
    [
      canvasRef,
      color,
      palette,
      pixelSize,
      tool,
      offset,
      zoom,
      setOffset,
      updateSpriteData,
    ]
  );

  const handlePointerUp = useCallback(() => {
    isPointerDown.current = false;
    lastPanPosition.current = null;
  }, []);

  const handlePointerLeave = useCallback(() => {
    isPointerDown.current = false;
    lastPanPosition.current = null;
  }, []);

  const initCanvas = useCallback(() => {
    if (!canvasRef.current) return;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        drawPixelOnCanvas(
          canvasRef.current,
          { x, y },
          MakeCodeColor.TRANSPARENT
        );
      }
    }

    initSpriteData();
  }, [canvasRef, height, width, initSpriteData]);

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerLeave,
    initCanvas,
  };
};
