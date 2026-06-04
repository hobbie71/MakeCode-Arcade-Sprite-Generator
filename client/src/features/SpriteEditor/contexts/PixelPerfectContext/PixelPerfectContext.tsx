import { createContext, useState, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";

type PixelPerfectContextType = {
  /**
   * When on (and the pencil stroke size is 1), the pencil removes the L-shaped
   * "corner" pixels that a mouse produces on diagonals, leaving clean 1px lines.
   */
  pixelPerfect: boolean;
  setPixelPerfect: Dispatch<SetStateAction<boolean>>;
};

const PixelPerfectContext = createContext<undefined | PixelPerfectContextType>(
  undefined
);

export const PixelPerfectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [pixelPerfect, setPixelPerfect] = useState<boolean>(false);

  const contextValue = useMemo(
    () => ({ pixelPerfect, setPixelPerfect }),
    [pixelPerfect]
  );

  return (
    <PixelPerfectContext.Provider value={contextValue}>
      {children}
    </PixelPerfectContext.Provider>
  );
};

export { PixelPerfectContext };
