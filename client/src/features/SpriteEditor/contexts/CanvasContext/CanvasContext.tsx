import { createContext, useRef, useMemo } from "react";

type CanvasContextType = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
};

const CanvasContext = createContext<undefined | CanvasContextType>(undefined);

export const CanvasProvider = ({ children }: { children: React.ReactNode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const contextValue = useMemo(
    () => ({
      canvasRef,
    }),
    []
  );

  return (
    <CanvasContext.Provider value={contextValue}>
      {children}
    </CanvasContext.Provider>
  );
};

export { CanvasContext };
