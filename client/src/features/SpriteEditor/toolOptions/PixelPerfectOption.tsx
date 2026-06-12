import Switch from "../../../components/Switch";
import { usePixelPerfect } from "../contexts/PixelPerfectContext/usePixelPerfect";

/**
 * "Pixel-perfect" stroke smoothing for the Pencil. Wired to PixelPerfectContext;
 * usePencil removes L-shaped corner pixels on diagonals when this is on (and the
 * brush size is 1).
 */
export default function PixelPerfectOption() {
  const { pixelPerfect, setPixelPerfect } = usePixelPerfect();
  return (
    <Switch
      label="Pixel-perfect"
      labelClassName="text-xs text-ink-subtle"
      checked={pixelPerfect}
      onChange={setPixelPerfect}
      title="Removes L-shaped corner pixels on diagonal strokes (brush size 1)."
    />
  );
}
