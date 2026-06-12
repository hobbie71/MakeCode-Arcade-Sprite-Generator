import { createContext, useState, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";

type SourceGhostContextType = {
  /** Whether the source image is projected over the canvas. Default off. */
  ghostVisible: boolean;
  setGhostVisible: Dispatch<SetStateAction<boolean>>;
  /** Ghost opacity, 0–1. Default 0.3. */
  ghostOpacity: number;
  setGhostOpacity: Dispatch<SetStateAction<number>>;
};

const SourceGhostContext = createContext<undefined | SourceGhostContextType>(
  undefined
);

export const SourceGhostProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [ghostVisible, setGhostVisible] = useState<boolean>(false);
  const [ghostOpacity, setGhostOpacity] = useState<number>(0.3);

  const contextValue = useMemo(
    () => ({ ghostVisible, setGhostVisible, ghostOpacity, setGhostOpacity }),
    [ghostVisible, ghostOpacity]
  );

  return (
    <SourceGhostContext.Provider value={contextValue}>
      {children}
    </SourceGhostContext.Provider>
  );
};

export { SourceGhostContext };
