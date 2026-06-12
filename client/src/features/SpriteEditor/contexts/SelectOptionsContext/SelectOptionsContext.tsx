import { createContext, useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

/** How an outside-the-selection drag/click creates the next selection. */
export type SelectionMode = "rectangle" | "wand" | "lasso";

type SelectOptionsContextType = {
  mode: SelectionMode;
  setMode: Dispatch<SetStateAction<SelectionMode>>;
  /**
   * Magic-wand scope. The canvas is palette-indexed (exact-match colors), so
   * this is a scope toggle, not a tolerance:
   *   true  → 4-connected flood of the clicked region (default)
   *   false → every cell of that color across the sprite
   */
  wandContiguous: boolean;
  setWandContiguous: Dispatch<SetStateAction<boolean>>;
};

const SelectOptionsContext = createContext<undefined | SelectOptionsContextType>(
  undefined
);

export const SelectOptionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mode, setMode] = useState<SelectionMode>("rectangle");
  // Default contiguous ON — the standard wand default and the right input for
  // move/resize (a single connected region, not scattered islands).
  const [wandContiguous, setWandContiguous] = useState(true);

  const contextValue = useMemo(
    () => ({ mode, setMode, wandContiguous, setWandContiguous }),
    [mode, wandContiguous]
  );

  return (
    <SelectOptionsContext.Provider value={contextValue}>
      {children}
    </SelectOptionsContext.Provider>
  );
};

export { SelectOptionsContext };
