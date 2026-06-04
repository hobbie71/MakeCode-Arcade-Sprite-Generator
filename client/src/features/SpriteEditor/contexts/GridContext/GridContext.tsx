import { createContext, useState, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";

type GridContextType = {
  /** Whether the per-pixel grid overlay is drawn on the canvas. Default on. */
  showGrid: boolean;
  setShowGrid: Dispatch<SetStateAction<boolean>>;
};

const GridContext = createContext<undefined | GridContextType>(undefined);

export const GridProvider = ({ children }: { children: React.ReactNode }) => {
  const [showGrid, setShowGrid] = useState<boolean>(true);

  const contextValue = useMemo(
    () => ({ showGrid, setShowGrid }),
    [showGrid]
  );

  return (
    <GridContext.Provider value={contextValue}>{children}</GridContext.Provider>
  );
};

export { GridContext };
