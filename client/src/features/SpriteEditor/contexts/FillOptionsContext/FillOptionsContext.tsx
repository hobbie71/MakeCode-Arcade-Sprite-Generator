import { createContext, useState, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";

type FillOptionsContextType = {
  /**
   * Bucket-fill scope. The canvas is palette-indexed (exact-match colors), so
   * this is a scope toggle, not a color-distance tolerance:
   *   false → contiguous flood-fill of the clicked color's region (4-connected)
   *   true  → global: recolor every pixel of that color across the whole canvas (default)
   */
  fillAll: boolean;
  setFillAll: Dispatch<SetStateAction<boolean>>;
};

const FillOptionsContext = createContext<undefined | FillOptionsContextType>(
  undefined
);

export const FillOptionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Default true → the "Contiguous" toggle starts OFF (active={!fillAll}).
  const [fillAll, setFillAll] = useState<boolean>(true);

  const contextValue = useMemo(() => ({ fillAll, setFillAll }), [fillAll]);

  return (
    <FillOptionsContext.Provider value={contextValue}>
      {children}
    </FillOptionsContext.Provider>
  );
};

export { FillOptionsContext };
