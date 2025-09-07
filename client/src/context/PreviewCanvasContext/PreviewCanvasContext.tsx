import { createContext, useRef, useMemo } from "react";

type PreviewCanvasContextType = {
  previewCanvasRef: React.RefObject<HTMLCanvasElement | null>;
};

const PreviewCanvasContext = createContext<
  undefined | PreviewCanvasContextType
>(undefined);

export const PreviewCanvasProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const contextValue = useMemo(
    () => ({
      previewCanvasRef,
    }),
    []
  );

  return (
    <PreviewCanvasContext.Provider value={contextValue}>
      {children}
    </PreviewCanvasContext.Provider>
  );
};

export { PreviewCanvasContext };
