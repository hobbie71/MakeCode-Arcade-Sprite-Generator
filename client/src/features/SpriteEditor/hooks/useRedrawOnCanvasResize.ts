import { useEffect, type RefObject } from "react";

/**
 * Redraw an overlay once the sprite canvas's box settles after a resize,
 * independent of React's effect timing (effects can run before layout
 * settles). Set up once per canvas (draw only changes on real inputs), so
 * panning doesn't churn the observer.
 */
export const useRedrawOnCanvasResize = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  draw: () => void
) => {
  useEffect(() => {
    const main = canvasRef.current;
    if (!main || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => draw());
    ro.observe(main);
    return () => ro.disconnect();
  }, [draw, canvasRef]);
};
