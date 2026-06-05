import { useState, useRef, useEffect } from "react";

import { useZoom } from "../contexts/ZoomContext/useZoom";
import { MIN_ZOOM, MAX_ZOOM } from "../constants/canvas";

// Quick-pick zoom levels (as scale factors), within the MIN_ZOOM–MAX_ZOOM range.
const PRESETS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3];

/**
 * Bottom-right zoom control: shows the current zoom and, on click, opens a menu
 * of preset levels plus "Fit to screen" (which fits and re-centers the canvas).
 */
export default function ZoomMenu() {
  const { zoom, setZoom, fitToScreen } = useZoom();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const applyZoom = (z: number) => {
    setZoom(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z)));
    setOpen(false);
  };

  const handleFit = () => {
    fitToScreen();
    setOpen(false);
  };

  const currentPct = Math.round(zoom * 100);

  return (
    <div ref={rootRef} className="absolute bottom-4 right-4">
      {open && (
        <div
          role="menu"
          className="absolute bottom-full right-0 mb-2 max-h-[70vh] w-40 overflow-y-auto rounded-card border border-line bg-surface-raised p-1 shadow-lg">
          {PRESETS.map((p) => {
            const pct = Math.round(p * 100);
            return (
              <button
                key={p}
                type="button"
                role="menuitem"
                onClick={() => applyZoom(p)}
                className="flex w-full items-center justify-between rounded-chip px-3 py-1.5 text-sm text-ink transition-colors hover:bg-surface-hover">
                <span>{pct}%</span>
                {currentPct === pct && <span aria-hidden>✓</span>}
              </button>
            );
          })}
          <div className="my-1 border-t border-line" />
          <button
            type="button"
            role="menuitem"
            onClick={handleFit}
            className="flex w-full items-center rounded-chip px-3 py-1.5 text-sm text-ink transition-colors hover:bg-surface-hover">
            Fit to screen
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Zoom level"
        aria-haspopup="menu"
        aria-expanded={open}
        className="whitespace-nowrap rounded-pill border border-line bg-surface-raised px-3 py-1.5 text-sm font-medium text-ink-muted shadow-md transition-colors hover:bg-surface-hover">
        {currentPct}%
      </button>
    </div>
  );
}
