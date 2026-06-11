import { useCallback, useEffect, useRef } from "react";

// Context imports
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { useSprite } from "../../../context/SpriteContext/useSprite";
import { useZoom } from "../contexts/ZoomContext/useZoom";
import { useSelection } from "../contexts/SelectionContext/useSelection";
import { useSelectOptions } from "../contexts/SelectOptionsContext/useSelectOptions";
import { useToolSelected } from "../contexts/ToolSelectedContext/useToolSelected";
import { EditorTools } from "../../../types/tools";

// Lib imports
import {
  getCanvasCoordinates,
  getCanvasPointFloat,
} from "../libs/getCanvasCoordinates";
import { maskFromFlood, maskFromRect, maskGet } from "../libs/selectionMask";
import type { MaskCombineMode } from "../libs/selectionMask";
import {
  boundsToRect,
  computeResizeRect,
  handleCursor,
  hitTestHandle,
} from "../libs/selectionHitTest";
import type { GridRect, HandleId } from "../libs/selectionHitTest";

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
    }
  | {
      kind: "resize";
      handle: HandleId;
      startRect: GridRect;
      startFlipX: boolean;
      startFlipY: boolean;
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
  const { spriteData } = useSprite();
  const { mode, wandContiguous } = useSelectOptions();
  const {
    floating,
    mask,
    bounds,
    beginDraft,
    updateDraft,
    commitDraftAsMask,
    clearSelection,
    liftSelection,
    setFloatingPosition,
    setFloatingTransform,
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

  /**
   * Hover feedback: directional arrows over a resize handle, "move" inside the
   * selection, crosshair elsewhere. Uses the same float-coordinate hit test as
   * the gesture so the cursor matches what a press would do.
   */
  const updateHoverCursor = useCallback(
    (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const fp = getCanvasPointFloat(canvas, e, zoomRef.current);
      const handle = bounds
        ? hitTestHandle(fp, boundsToRect(bounds), zoomRef.current)
        : null;
      if (handle) {
        canvas.style.cursor = handleCursor(handle);
        return;
      }
      const p = getCanvasCoordinates(canvas, e, zoomRef.current);
      canvas.style.cursor = isInsideSelection(p) ? "move" : "crosshair";
    },
    [canvasRef, bounds, isInsideSelection]
  );

  const handlePointerDown = useCallback(
    (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      if (e.button !== 0) return;
      if (gestureRef.current) return;

      const start = getCanvasCoordinates(canvas, e, zoomRef.current);
      const startFloat = getCanvasPointFloat(canvas, e, zoomRef.current);
      const inBounds =
        start.x >= 0 && start.y >= 0 && start.x < width && start.y < height;
      const combine: MaskCombineMode = e.shiftKey
        ? "add"
        : e.altKey
          ? "subtract"
          : "replace";
      const plainPress = combine === "replace";

      const install = (
        onMove: (ev: MouseEvent) => void,
        onUp: (ev: MouseEvent) => void
      ) => {
        const up = (ev: MouseEvent) => {
          removeListenersRef.current?.();
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

      // A resize handle takes priority over everything (incl. modifiers, which
      // mean aspect-lock here, not add/subtract). Lift lazily, then drag the
      // grabbed edge; flips come from the signed-rect math.
      const handle = bounds
        ? hitTestHandle(startFloat, boundsToRect(bounds), zoomRef.current)
        : null;
      if (handle) {
        const startFlipX = floating?.flipX ?? false;
        const startFlipY = floating?.flipY ?? false;
        const rect = liftSelection();
        if (!rect) return;
        gestureRef.current = {
          kind: "resize",
          handle,
          startRect: { x: rect.x, y: rect.y, w: rect.w, h: rect.h },
          startFlipX,
          startFlipY,
        };
        install(
          (ev) => {
            const g = gestureRef.current;
            if (g?.kind !== "resize") return;
            const fp = getCanvasPointFloat(canvas, ev, zoomRef.current);
            const res = computeResizeRect(
              g.startRect,
              g.handle,
              fp,
              g.startFlipX,
              g.startFlipY,
              ev.shiftKey,
              width,
              height
            );
            setFloatingTransform(res.rect, res.flipX, res.flipY);
          },
          () => {
            gestureRef.current = null;
          }
        );
        return;
      }

      // Click on the stage outside the sprite (and off any handle): anchor a
      // float / deselect.
      if (!inBounds) {
        if (floating) commitFloating();
        clearSelection();
        return;
      }

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

      // Wand mode resolves on the click itself — no drag. The flood mask
      // combines with the current selection via the Shift/Alt modifiers.
      if (mode === "wand") {
        commitDraftAsMask(
          maskFromFlood(spriteData, width, height, start, wandContiguous),
          combine
        );
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
      bounds,
      mode,
      wandContiguous,
      spriteData,
      isInsideSelection,
      liftSelection,
      setFloatingPosition,
      setFloatingTransform,
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
