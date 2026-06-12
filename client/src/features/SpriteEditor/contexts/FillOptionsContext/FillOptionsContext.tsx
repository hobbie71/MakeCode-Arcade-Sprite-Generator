import { createStateContext } from "../../../../context/createStateContext";

/**
 * Bucket-fill scope. The canvas is palette-indexed (exact-match colors), so
 * this is a scope toggle, not a color-distance tolerance:
 *   false → contiguous flood-fill of the clicked color's region (4-connected) (default)
 *   true  → global: recolor every pixel of that color across the whole canvas
 *
 * Default false → the "Contiguous" toggle starts ON (checked={!fillAll}), which
 * matches the conventional paint-bucket default.
 */
const { Context: FillOptionsContext, Provider: FillOptionsProvider } =
  createStateContext<boolean>(false);

export { FillOptionsContext, FillOptionsProvider };
