import { useZoom } from "../contexts/ZoomContext/useZoom";
import { MIN_ZOOM, MAX_ZOOM } from "../constants/canvas";
import PopoverMenu from "./PopoverMenu";
import type { PopoverMenuItem } from "./PopoverMenu";

// Quick-pick zoom levels (as scale factors), within the MIN_ZOOM–MAX_ZOOM range.
const PRESETS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3];

/**
 * Bottom-right zoom control: shows the current zoom and opens a menu of preset
 * levels plus "Fit to screen" (which fits and re-centers the canvas).
 */
export default function ZoomMenu() {
  const { zoom, setZoom, fitToScreen } = useZoom();
  const currentPct = Math.round(zoom * 100);

  const items: PopoverMenuItem[] = PRESETS.map((p) => ({
    key: String(p),
    label: `${Math.round(p * 100)}%`,
    selected: currentPct === Math.round(p * 100),
    onSelect: () => setZoom(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, p))),
  }));

  return (
    <PopoverMenu
      ariaLabel="Zoom level"
      trigger={`${currentPct}%`}
      items={items}
      footer={{ key: "fit", label: "Fit to screen", onSelect: fitToScreen }}
      align="right"
      className="absolute bottom-4 right-4"
    />
  );
}
