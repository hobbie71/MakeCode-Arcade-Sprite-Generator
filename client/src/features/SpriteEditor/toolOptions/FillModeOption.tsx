import Switch from "../../../components/Switch";
import { useFillOptions } from "../contexts/FillOptionsContext/useFillOptions";

/**
 * Fill scope for the bucket tool. Wired to FillOptionsContext. The canvas is
 * palette-indexed (exact-match colors), so this is a scope toggle, not a
 * color-distance tolerance. Framed as "Contiguous":
 *   on  → flood-fill the contiguous region of the clicked color (4-connected)
 *   off → recolor every pixel of that color across the whole sprite
 */
export default function FillModeOption() {
  const { fillAll, setFillAll } = useFillOptions();
  return (
    <Switch
      label="Contiguous"
      labelClassName="text-xs text-ink-subtle"
      checked={!fillAll}
      onChange={(next) => setFillAll(!next)}
      title="On: fill only the connected region of this color. Off: recolor every matching pixel in the sprite."
    />
  );
}
