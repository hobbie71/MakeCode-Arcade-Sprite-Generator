import { createContext, useState, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";

type FillOptionsContextType = {
  /**
   * Bucket-fill spread, 0–100. Because the canvas is palette-indexed (not
   * continuous color), tolerance controls how far a fill reaches rather than a
   * color-distance threshold:
   *   0       → 4-connected contiguous region (default)
   *   1..99   → 8-connected (bridges diagonal gaps)
   *   100     → global: every pixel of the target color on the canvas
   */
  tolerance: number;
  setTolerance: Dispatch<SetStateAction<number>>;
};

const FillOptionsContext = createContext<undefined | FillOptionsContextType>(
  undefined
);

export const FillOptionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [tolerance, setTolerance] = useState<number>(0);

  const contextValue = useMemo(
    () => ({ tolerance, setTolerance }),
    [tolerance]
  );

  return (
    <FillOptionsContext.Provider value={contextValue}>
      {children}
    </FillOptionsContext.Provider>
  );
};

export { FillOptionsContext };
