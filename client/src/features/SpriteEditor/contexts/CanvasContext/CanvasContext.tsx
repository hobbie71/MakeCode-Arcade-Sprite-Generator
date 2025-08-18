import { createContext, useRef } from "react";

type CanvasContextType = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
};

const CanvasContext = createContext<undefined | CanvasContextType>(undefined);

export const CanvasProvider = ({ children }: { children: React.ReactNode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <CanvasContext.Provider value={{ canvasRef }}>
      {children}
    </CanvasContext.Provider>
  );
};

export { CanvasContext };
