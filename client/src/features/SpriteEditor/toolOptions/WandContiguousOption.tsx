import Switch from "../../../components/Switch";
import { useSelectOptions } from "../contexts/SelectOptionsContext/useSelectOptions";

/**
 * Magic-wand scope toggle, shown only in Wand mode. The canvas is
 * palette-indexed (exact-match colors), so this is a scope toggle, not a
 * tolerance — framed as "Contiguous" like the Fill tool:
 *   on  → select only the connected region of the clicked color (4-connected)
 *   off → select every matching pixel across the sprite
 */
export default function WandContiguousOption() {
  const { mode, wandContiguous, setWandContiguous } = useSelectOptions();
  if (mode !== "wand") return null;
  return (
    <Switch
      label="Contiguous"
      labelClassName="text-xs text-ink-subtle"
      checked={wandContiguous}
      onChange={setWandContiguous}
      title="On: select only the connected region of this color. Off: select every matching pixel in the sprite."
    />
  );
}
