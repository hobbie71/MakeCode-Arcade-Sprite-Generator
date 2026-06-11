import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import PopoverMenu from "./PopoverMenu";
import type { PopoverMenuItem } from "./PopoverMenu";

// Common pixel-art canvas sizes. Mostly squares, plus the 160×120 MakeCode
// Arcade screen; the 16×16 default sits near the top of the list.
const SIZE_PRESETS: [number, number][] = [
  [8, 8],
  [16, 16],
  [24, 24],
  [32, 32],
  [64, 64],
  [120, 120],
  [160, 120],
  [160, 160],
];

interface Props {
  /** Opens the full Resize & Process modal for non-square / arbitrary sizes. */
  onOpenCustom: () => void;
}

/**
 * Bottom-left pixel-size control: shows the current W×H and opens a quick menu
 * of common canvas sizes plus "Custom size…" (the full Resize & Process modal).
 * Picking a preset sets the canvas dimensions; SpriteDataResizer then resamples
 * the grid to match.
 */
export default function SizeMenu({ onOpenCustom }: Props) {
  const { width, height, setWidth, setHeight } = useCanvasSize();

  const items: PopoverMenuItem[] = SIZE_PRESETS.map(([w, h]) => ({
    key: `${w}x${h}`,
    label: `${w} × ${h}`,
    selected: width === w && height === h,
    onSelect: () => {
      setWidth(w);
      setHeight(h);
    },
  }));

  return (
    <PopoverMenu
      ariaLabel="Canvas size"
      trigger={`${width} × ${height}`}
      items={items}
      footer={{ key: "custom", label: "Custom size…", onSelect: onOpenCustom }}
      align="left"
      className="absolute bottom-4 left-4"
    />
  );
}
