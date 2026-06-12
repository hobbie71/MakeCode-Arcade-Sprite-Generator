import { useCallback, useEffect, useRef } from "react";

import { useGrid } from "../contexts/GridContext/useGrid";
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { beginOverlayFrame } from "../libs/overlayCanvas";
import { useRedrawOnCanvasResize } from "../hooks/useRedrawOnCanvasResize";

interface Props {
  width: number;
  height: number;
  /**
   * Accepted for API parity with the other overlays. Geometry now comes from the
   * sprite canvas's measured on-screen box, so the cell size isn't derived from
   * pixelSize here.
   */
  pixelSize?: number;
  offset: { x: number; y: number };
  zoom: number;
}

/**
 * Zoom-aware grid overlay.
 *
 * The grid is deliberately NOT baked into the sprite bitmap. That bitmap is shown
 * scaled to the current zoom by a fractional CSS transform with
 * `image-rendering: pixelated` (see Canvas.tsx). Baking 1px lines into it and then
 * nearest-neighbor-scaling by a non-integer factor (zoom × devicePixelRatio)
 * drops/doubles the thin lines unevenly — so the grid distorted at most zoom
 * levels. Instead this overlay fills the stage and draws the lines directly at the
 * display's device resolution: one crisp 1-device-pixel line per grid edge.
 *
 * The grid's BOX is taken from the sprite canvas's actual rendered rect
 * (getBoundingClientRect), not recomputed from offset/zoom. Recomputing it
 * independently let the grid end up a hair larger/smaller than the rendered sprite
 * — a small right/bottom gap after a size change that only disappeared once a
 * manual zoom forced a redraw. Anchoring the outer lines to the measured edges
 * makes the grid exactly track the canvas. A ResizeObserver on the sprite canvas
 * also redraws once its box settles after a resize, independent of React's effect
 * timing (a size change updates the canvas's layout box only after commit +
 * layout).
 */
const GridOverlay = ({ width, height, offset, zoom }: Props) => {
  const { showGrid } = useGrid();
  const { canvasRef } = useCanvas();
  const gridRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const frame = beginOverlayFrame(grid, canvasRef.current);
    if (!frame) return;
    if (!showGrid) return;

    const { ctx } = frame;
    const { left, top, w, h } = frame.box;

    ctx.strokeStyle = "#3f3f46";
    ctx.lineWidth = 1; // one device pixel — a crisp hairline at any zoom

    // Vertical lines. i === width lands exactly on the canvas's right edge, so the
    // grid never overhangs the sprite.
    const y0 = Math.max(0, Math.round(top));
    const y1 = Math.min(grid.height, Math.round(top + h));
    for (let i = 0; i <= width; i++) {
      const x = Math.round(left + (w * i) / width);
      if (x < 0 || x > grid.width) continue;
      ctx.beginPath();
      ctx.moveTo(x + 0.5, y0);
      ctx.lineTo(x + 0.5, y1);
      ctx.stroke();
    }

    // Horizontal lines.
    const x0 = Math.max(0, Math.round(left));
    const x1 = Math.min(grid.width, Math.round(left + w));
    for (let j = 0; j <= height; j++) {
      const y = Math.round(top + (h * j) / height);
      if (y < 0 || y > grid.height) continue;
      ctx.beginPath();
      ctx.moveTo(x0, y + 0.5);
      ctx.lineTo(x1, y + 0.5);
      ctx.stroke();
    }
  }, [showGrid, width, height, canvasRef]);

  // Redraw on grid toggle, size, pan, and zoom. offset/zoom aren't read inside
  // draw() (geometry comes from the measured canvas rect) but they signal the
  // sprite moved/scaled, so they must retrigger a redraw.
  useEffect(() => {
    draw();
  }, [draw, offset, zoom]);

  useRedrawOnCanvasResize(canvasRef, draw);

  return (
    <canvas
      ref={gridRef}
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
    />
  );
};

export default GridOverlay;
