import { useCallback, useEffect, useRef } from "react";

// Context imports
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { useZoom } from "../contexts/ZoomContext/useZoom";
import { useSelection } from "../contexts/SelectionContext/useSelection";

// Lib imports
import { getCanvasCoordinates } from "../libs/getCanvasCoordinates";
import { maskFromRect } from "../libs/selectionMask";
import type { MaskCombineMode } from "../libs/selectionMask";

// Type imports
import type { Coordinates } from "../../../types/pixel";

/** Client-pixel movement below this is a click, not a drag (MakeCode uses 3). */
const DRAG_THRESHOLD_PX = 3;

type SelectGesture = {
  kind: "draw-rect";
  anchor: Coordinates;
  combine: MaskCombineMode;
  startClientX: number;
  startClientY: number;
  dragged: boolean;
};

/**
 * Pointer gestures for the Select tool. Unlike the drawing tools (which ride
 * useMouseHandler's canvas-element events), a select gesture installs its own
 * window-level mousemove/mouseup listeners at mousedown: the canvas-element
 * flow ignores out-of-bounds moves, which would freeze a marquee drag at the
 * sprite edge.
 */
export const useSelectTool = () => {
  const { canvasRef } = useCanvas();
  const { zoom } = useZoom();
  const { width, height } = useCanvasSize();
  const { beginDraft, updateDraft, commitDraftAsMask, clearSelection } =
    useSelection();

  // Gesture listeners read zoom live (pinch-zoom can happen mid-drag).
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;

  const gestureRef = useRef<SelectGesture | null>(null);
  const removeListenersRef = useRef<(() => void) | null>(null);

  // Drop dangling window listeners if the editor unmounts mid-gesture.
  useEffect(() => () => removeListenersRef.current?.(), []);

  const clampToCanvas = useCallback(
    (c: Coordinates): Coordinates => ({
      x: Math.max(0, Math.min(width - 1, c.x)),
      y: Math.max(0, Math.min(height - 1, c.y)),
    }),
    [width, height]
  );

  const handlePointerDown = useCallback(
    (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      if (e.button !== 0) return;
      if (gestureRef.current) return;

      const start = getCanvasCoordinates(canvas, e, zoomRef.current);
      const inBounds =
        start.x >= 0 && start.y >= 0 && start.x < width && start.y < height;
      const combine: MaskCombineMode = e.shiftKey
        ? "add"
        : e.altKey
          ? "subtract"
          : "replace";

      // Click on the stage outside the sprite: just deselect.
      if (!inBounds) {
        clearSelection();
        return;
      }

      const gesture: SelectGesture = {
        kind: "draw-rect",
        anchor: start,
        combine,
        startClientX: e.clientX,
        startClientY: e.clientY,
        dragged: false,
      };
      gestureRef.current = gesture;

      const onMove = (ev: MouseEvent) => {
        const g = gestureRef.current;
        if (!g) return;
        if (!g.dragged) {
          const moved = Math.max(
            Math.abs(ev.clientX - g.startClientX),
            Math.abs(ev.clientY - g.startClientY)
          );
          if (moved <= DRAG_THRESHOLD_PX) return;
          g.dragged = true;
          // The draft only appears once the press becomes a real drag, so a
          // plain click never flashes a one-pixel marquee.
          beginDraft({ kind: "rect", anchor: g.anchor, head: g.anchor });
        }
        const head = clampToCanvas(
          getCanvasCoordinates(canvas, ev, zoomRef.current)
        );
        updateDraft({ kind: "rect", anchor: g.anchor, head });
      };

      const cleanup = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        removeListenersRef.current = null;
      };

      const onUp = (ev: MouseEvent) => {
        cleanup();
        const g = gestureRef.current;
        gestureRef.current = null;
        if (!g) return;

        // A plain click (no drag) deselects.
        if (!g.dragged) {
          clearSelection();
          return;
        }

        const head = clampToCanvas(
          getCanvasCoordinates(canvas, ev, zoomRef.current)
        );
        commitDraftAsMask(
          maskFromRect(width, height, g.anchor, head),
          g.combine
        );
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      removeListenersRef.current = cleanup;
    },
    [
      canvasRef,
      width,
      height,
      beginDraft,
      updateDraft,
      commitDraftAsMask,
      clearSelection,
      clampToCanvas,
    ]
  );

  return { handlePointerDown };
};
