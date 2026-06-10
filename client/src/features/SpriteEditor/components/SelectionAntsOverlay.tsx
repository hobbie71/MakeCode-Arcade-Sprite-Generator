import { useCallback, useEffect, useMemo, useRef } from "react";

import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { useSelection } from "../contexts/SelectionContext/useSelection";
import { buildMaskOutline } from "../libs/selectionOutline";

interface Props {
  width: number;
  height: number;
  /** Accepted for API parity with the other overlays (geometry is measured). */
  pixelSize?: number;
  offset: { x: number; y: number };
  zoom: number;
}

/** Aseprite's ants cadence (~10fps) — smoother burns frames for nothing. */
const ANTS_TICK_MS = 100;
/** Dash length in CSS px — converted to device px and sprite units at draw. */
const DASH_CSS_PX = 4;

/**
 * Marching-ants overlay. Like GridOverlay it fills the stage at device
 * resolution and takes its geometry from the sprite canvas's measured rect, so
 * it tracks zoom/pan/resize exactly. The outline path lives in sprite-pixel
 * units (built from the mask) and is scaled at draw time — ants snap to pixel
 * edges at any zoom. Double stroke: solid white under animated black dashes,
 * visible over every palette color (ADR-0007 decision 9).
 */
const SelectionAntsOverlay = ({ width, height, offset, zoom }: Props) => {
  const { canvasRef } = useCanvas();
  const { phase, mask, draft } = useSelection();
  const antsRef = useRef<HTMLCanvasElement>(null);
  const tickRef = useRef(0);

  const maskOutline = useMemo(
    () => (mask ? buildMaskOutline(mask) : null),
    [mask]
  );

  // In-flight draft outline (rect for now; the lasso adds a polyline kind).
  const draftPath = useMemo(() => {
    if (!draft) return null;
    const path = new Path2D();
    if (draft.kind === "rect") {
      const minX = Math.min(draft.anchor.x, draft.head.x);
      const minY = Math.min(draft.anchor.y, draft.head.y);
      const maxX = Math.max(draft.anchor.x, draft.head.x);
      const maxY = Math.max(draft.anchor.y, draft.head.y);
      path.rect(minX, minY, maxX - minX + 1, maxY - minY + 1);
    } else {
      draft.path.forEach((p, i) => {
        // Trace through cell centers so the in-progress lasso reads naturally.
        if (i === 0) path.moveTo(p.x + 0.5, p.y + 0.5);
        else path.lineTo(p.x + 0.5, p.y + 0.5);
      });
    }
    return path;
  }, [draft]);

  const draw = useCallback(() => {
    const ants = antsRef.current;
    const parent = ants?.parentElement;
    const main = canvasRef.current;
    if (!ants || !parent || !main) return;

    const dpr = window.devicePixelRatio || 1;
    const bw = Math.round(parent.clientWidth * dpr);
    const bh = Math.round(parent.clientHeight * dpr);
    if (ants.width !== bw) ants.width = bw;
    if (ants.height !== bh) ants.height = bh;

    const ctx = ants.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, ants.width, ants.height);

    const path = draftPath ?? maskOutline;
    if (!path) return;

    // Sprite box in this overlay's device pixels (same scheme as GridOverlay).
    const mr = main.getBoundingClientRect();
    const pr = parent.getBoundingClientRect();
    const left = (mr.left - pr.left) * dpr;
    const top = (mr.top - pr.top) * dpr;
    const cell = (mr.width * dpr) / width; // device px per sprite px (square)

    ctx.save();
    ctx.translate(left, top);
    ctx.scale(cell, (mr.height * dpr) / height);

    // Stroke metrics are wanted in device px; the context is in sprite units,
    // so divide by the cell scale to keep them screen-constant at any zoom.
    const lw = Math.max(1, dpr) / cell;
    const dash = (DASH_CSS_PX * dpr) / cell;

    ctx.lineWidth = lw;
    ctx.strokeStyle = "#ffffff";
    ctx.setLineDash([]);
    ctx.stroke(path);

    ctx.strokeStyle = "#000000";
    ctx.setLineDash([dash, dash]);
    // Tick by half a dash so the ants march one full period every 8 ticks.
    ctx.lineDashOffset = -((tickRef.current % 8) / 4) * dash;
    ctx.stroke(path);
    ctx.restore();
  }, [canvasRef, width, height, draftPath, maskOutline]);

  // Redraw on selection, pan, and zoom changes (geometry is re-measured).
  useEffect(() => {
    draw();
  }, [draw, offset, zoom]);

  // Redraw once the sprite canvas's box settles after a resize (GridOverlay's
  // trick — React effects can run before layout settles).
  useEffect(() => {
    const main = canvasRef.current;
    if (!main || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => draw());
    ro.observe(main);
    return () => ro.disconnect();
  }, [draw, canvasRef]);

  // March only while something is on screen.
  useEffect(() => {
    if (phase === "idle") return;
    const id = window.setInterval(() => {
      tickRef.current = (tickRef.current + 1) % 8;
      draw();
    }, ANTS_TICK_MS);
    return () => window.clearInterval(id);
  }, [phase, draw]);

  return (
    <canvas
      ref={antsRef}
      className="pointer-events-none absolute inset-0 z-40 h-full w-full"
    />
  );
};

export default SelectionAntsOverlay;
