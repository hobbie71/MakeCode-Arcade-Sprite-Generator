import { useCallback, useEffect, useRef } from "react";

// Context imports
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { useZoom } from "../contexts/ZoomContext/useZoom";
import { useSelection } from "../contexts/SelectionContext/useSelection";
import { useToolSelected } from "../contexts/ToolSelectedContext/useToolSelected";
import { EditorTools } from "../../../types/tools";

// Lib imports
import { getCanvasCoordinates } from "../libs/getCanvasCoordinates";
import { maskFromRect, maskGet } from "../libs/selectionMask";
import type { MaskCombineMode } from "../libs/selectionMask";

// Type imports
import type { Coordinates } from "../../../types/pixel";

/** Client-pixel movement below this is a click, not a drag (MakeCode uses 3). */
const DRAG_THRESHOLD_PX = 3;

type SelectGesture =
  | {
      kind: "draw-rect";
      anchor: Coordinates;
      combine: MaskCombineMode;
      startClientX: number;
      startClientY: number;
      dragged: boolean;
    }
  | {
      kind: "move";
      grabDX: number;
      grabDY: number;
    };

/**
 * Pointer gestures for the Select tool. Unlike the drawing tools (which ride
 * useMouseHandler's canvas-element events), a select gesture installs its own
 * window-level mousemove/mouseup listeners at mousedown: the canvas-element
 * flow ignores out-of-bounds moves, which would freeze a marquee drag at the
 * sprite edge — and a floating move must be able to leave the sprite entirely.
 */
export const useSelectTool = () => {
  const { canvasRef } = useCanvas();
  const { zoom } = useZoom();
  const { width, height } = useCanvasSize();
  const { tool } = useToolSelected();
  const {
    floating,
    mask,
    beginDraft,
    updateDraft,
    commitDraftAsMask,
    clearSelection,
    liftSelection,
    setFloatingPosition,
    commitFloating,
  } = useSelection();

  // Gesture listeners read zoom live (pinch-zoom can happen mid-drag).
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;

  const gestureRef = useRef<SelectGesture | null>(null);
  const removeListenersRef = useRef<(() => void) | null>(null);

  // Drop dangling window listeners if the editor unmounts mid-gesture.
  useEffect(() => () => removeListenersRef.current?.(), []);

  // Leaving the Select tool clears any cursor override on the canvas.
  useEffect(() => {
    if (tool === EditorTools.Select) return;
    const canvas = canvasRef.current;
    if (canvas) canvas.style.cursor = "";
  }, [tool, canvasRef]);

  const clampToCanvas = useCallback(
    (c: Coordinates): Coordinates => ({
      x: Math.max(0, Math.min(width - 1, c.x)),
      y: Math.max(0, Math.min(height - 1, c.y)),
    }),
    [width, height]
  );

  /** Hit-test against the floating buffer's mask or the selection mask. */
  const isInsideSelection = useCallback(
    (p: Coordinates): boolean => {
      if (floating) {
        const lx = p.x - floating.rect.x;
        const ly = p.y - floating.rect.y;
        return maskGet(floating.basisMask, lx, ly);
      }
      return mask ? maskGet(mask, p.x, p.y) : false;
    },
    [floating, mask]
  );

  /** Hover feedback: "move" over the selection, crosshair elsewhere. */
  const updateHoverCursor = useCallback(
    (p: Coordinates) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.style.cursor = isInsideSelection(p) ? "move" : "crosshair";
    },
    [canvasRef, isInsideSelection]
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
      const plainPress = combine === "replace";

      // Click on the stage outside the sprite: anchor a float / deselect.
      if (!inBounds) {
        if (floating) commitFloating();
        clearSelection();
        return;
      }

      const cleanup = () => {
        removeListenersRef.current?.();
      };
      const install = (
        onMove: (ev: MouseEvent) => void,
        onUp: (ev: MouseEvent) => void
      ) => {
        const up = (ev: MouseEvent) => {
          cleanup();
          onUp(ev);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", up);
        removeListenersRef.current = () => {
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseup", up);
          removeListenersRef.current = null;
        };
      };

      // Plain press inside the selection: move it (lifting lazily first).
      if (plainPress && isInsideSelection(start)) {
        const rect = liftSelection();
        if (!rect) return;
        gestureRef.current = {
          kind: "move",
          grabDX: start.x - rect.x,
          grabDY: start.y - rect.y,
        };
        install(
          (ev) => {
            const g = gestureRef.current;
            if (g?.kind !== "move") return;
            // Unclamped: the float may be dragged partly/fully off-canvas.
            const p = getCanvasCoordinates(canvas, ev, zoomRef.current);
            setFloatingPosition(p.x - g.grabDX, p.y - g.grabDY);
          },
          () => {
            gestureRef.current = null;
          }
        );
        return;
      }

      // Anything else starts a new selection; an active float anchors first.
      if (floating) commitFloating();

      const gesture: SelectGesture = {
        kind: "draw-rect",
        anchor: start,
        combine,
        startClientX: e.clientX,
        startClientY: e.clientY,
        dragged: false,
      };
      gestureRef.current = gesture;

      install(
        (ev) => {
          const g = gestureRef.current;
          if (g?.kind !== "draw-rect") return;
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
        },
        (ev) => {
          const g = gestureRef.current;
          gestureRef.current = null;
          if (g?.kind !== "draw-rect") return;

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
        }
      );
    },
    [
      canvasRef,
      width,
      height,
      floating,
      isInsideSelection,
      liftSelection,
      setFloatingPosition,
      commitFloating,
      beginDraft,
      updateDraft,
      commitDraftAsMask,
      clearSelection,
      clampToCanvas,
    ]
  );

  return { handlePointerDown, updateHoverCursor };
};
