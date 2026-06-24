import { useCallback, useEffect, useRef } from "react";
import { flushSync } from "react-dom";

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
import {
  maskFromFlood,
  maskFromLassoPath,
  maskFromRect,
  maskGet,
} from "../libs/selectionMask";
import type { MaskCombineMode } from "../libs/selectionMask";
import { getLineCoordinates } from "../libs/getShapeCoordinates";
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

/** Has the pointer moved past the click/drag threshold since the press? */
const isDragPastThreshold = (
  ev: MouseEvent,
  start: { startClientX: number; startClientY: number }
): boolean =>
  Math.max(
    Math.abs(ev.clientX - start.startClientX),
    Math.abs(ev.clientY - start.startClientY)
  ) > DRAG_THRESHOLD_PX;

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
    }
  | {
      kind: "draw-lasso";
      combine: MaskCombineMode;
      path: Coordinates[];
      startClientX: number;
      startClientY: number;
      dragged: boolean;
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
    floatingPixels,
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

  /**
   * Hit-test against the floating buffer's CURRENT (derived) mask or the
   * selection mask. Using floatingPixels.mask — not floating.basisMask — is
   * load-bearing: after a resize the rect changes size while the basis stays
   * the original dimensions, so testing the basis would report points inside a
   * grown float as "outside" and a move-press would start a new marquee.
   */
  const isInsideSelection = useCallback(
    (p: Coordinates): boolean => {
      if (floating && floatingPixels) {
        const lx = p.x - floating.rect.x;
        const ly = p.y - floating.rect.y;
        return maskGet(floatingPixels.mask, lx, ly);
      }
      return mask ? maskGet(mask, p.x, p.y) : false;
    },
    [floating, floatingPixels, mask]
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

  /** Window-level listeners for the life of one gesture (see hook docblock). */
  const installGestureListeners = useCallback(
    (onMove: (ev: MouseEvent) => void, onUp: (ev: MouseEvent) => void) => {
      const up = (ev: MouseEvent) => {
        removeListenersRef.current?.();
        onUp(ev);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", up);
      removeListenersRef.current = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", up);
        removeListenersRef.current = null;
      };
    },
    []
  );

  // Lift lazily, then drag the grabbed edge; flips come from the signed-rect
  // math.
  const startResizeGesture = useCallback(
    (canvas: HTMLCanvasElement, handle: HandleId) => {
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
      installGestureListeners(
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
          // flushSync for the same reason as the move gesture: raw-listener
          // updates must commit synchronously to stay live during the drag.
          flushSync(() => setFloatingTransform(res.rect, res.flipX, res.flipY));
        },
        () => {
          gestureRef.current = null;
        }
      );
    },
    [floating, liftSelection, width, height, setFloatingTransform, installGestureListeners]
  );

  // Move the selection under the pointer (lifting lazily first).
  const startMoveGesture = useCallback(
    (canvas: HTMLCanvasElement, start: Coordinates) => {
      const rect = liftSelection();
      if (!rect) return;
      gestureRef.current = {
        kind: "move",
        grabDX: start.x - rect.x,
        grabDY: start.y - rect.y,
      };
      installGestureListeners(
        (ev) => {
          const g = gestureRef.current;
          if (g?.kind !== "move") return;
          // Unclamped: the float may be dragged partly/fully off-canvas.
          const p = getCanvasCoordinates(canvas, ev, zoomRef.current);
          // flushSync: this runs in a raw window listener, and React 18 won't
          // flush the update until its next render — which, when the gesture
          // didn't lift (already floating), never comes, so the float would
          // appear frozen. Forcing a synchronous commit keeps the drag live.
          flushSync(() => setFloatingPosition(p.x - g.grabDX, p.y - g.grabDY));
        },
        () => {
          gestureRef.current = null;
        }
      );
    },
    [liftSelection, setFloatingPosition, installGestureListeners]
  );

  // Lasso mode: trace a freehand path, Bresenham-filling gaps between
  // samples; the closed polygon rasterizes to a mask on release.
  const startLassoGesture = useCallback(
    (
      canvas: HTMLCanvasElement,
      e: React.MouseEvent,
      start: Coordinates,
      combine: MaskCombineMode
    ) => {
      gestureRef.current = {
        kind: "draw-lasso",
        combine,
        path: [start],
        startClientX: e.clientX,
        startClientY: e.clientY,
        dragged: false,
      };
      installGestureListeners(
        (ev) => {
          const g = gestureRef.current;
          if (g?.kind !== "draw-lasso") return;
          if (!g.dragged) {
            if (!isDragPastThreshold(ev, g)) return;
            g.dragged = true;
            beginDraft({ kind: "lasso", path: g.path });
          }
          const p = clampToCanvas(
            getCanvasCoordinates(canvas, ev, zoomRef.current)
          );
          const last = g.path[g.path.length - 1];
          if (last.x === p.x && last.y === p.y) return;
          // Fill the gap so fast drags don't leave a broken outline.
          const seg = getLineCoordinates(last, p);
          for (let i = 1; i < seg.length; i++) g.path.push(seg[i]);
          updateDraft({ kind: "lasso", path: [...g.path] });
        },
        () => {
          const g = gestureRef.current;
          gestureRef.current = null;
          if (g?.kind !== "draw-lasso") return;
          // A plain click (no drag) deselects.
          if (!g.dragged) {
            clearSelection();
            return;
          }
          commitDraftAsMask(
            maskFromLassoPath(width, height, g.path),
            g.combine
          );
        }
      );
    },
    [
      width,
      height,
      beginDraft,
      updateDraft,
      commitDraftAsMask,
      clearSelection,
      clampToCanvas,
      installGestureListeners,
    ]
  );

  // Rect marquee: the default drag-out selection.
  const startRectGesture = useCallback(
    (
      canvas: HTMLCanvasElement,
      e: React.MouseEvent,
      start: Coordinates,
      combine: MaskCombineMode
    ) => {
      gestureRef.current = {
        kind: "draw-rect",
        anchor: start,
        combine,
        startClientX: e.clientX,
        startClientY: e.clientY,
        dragged: false,
      };
      installGestureListeners(
        (ev) => {
          const g = gestureRef.current;
          if (g?.kind !== "draw-rect") return;
          if (!g.dragged) {
            if (!isDragPastThreshold(ev, g)) return;
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
      width,
      height,
      beginDraft,
      updateDraft,
      commitDraftAsMask,
      clearSelection,
      clampToCanvas,
      installGestureListeners,
    ]
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

      // A resize handle takes priority over everything (incl. modifiers, which
      // mean aspect-lock here, not add/subtract).
      const handle = bounds
        ? hitTestHandle(startFloat, boundsToRect(bounds), zoomRef.current)
        : null;
      if (handle) {
        startResizeGesture(canvas, handle);
        return;
      }

      // Click on the stage outside the sprite (and off any handle): anchor a
      // float / deselect.
      if (!inBounds) {
        if (floating) commitFloating();
        clearSelection();
        return;
      }

      // Plain press inside the selection: move it.
      if (plainPress && isInsideSelection(start)) {
        startMoveGesture(canvas, start);
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

      if (mode === "lasso") {
        startLassoGesture(canvas, e, start, combine);
        return;
      }

      startRectGesture(canvas, e, start, combine);
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
      commitFloating,
      commitDraftAsMask,
      clearSelection,
      startResizeGesture,
      startMoveGesture,
      startLassoGesture,
      startRectGesture,
    ]
  );

  return { handlePointerDown, updateHoverCursor };
};
