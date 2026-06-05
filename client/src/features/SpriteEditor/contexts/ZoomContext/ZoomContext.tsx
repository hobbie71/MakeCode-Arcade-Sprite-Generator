import { createContext, useState, useMemo, useRef, useCallback } from "react";

type ZoomContextType = {
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  /**
   * Fit the canvas to the stage and re-center it. The implementation lives in
   * Canvas (which owns the stage container and pan offset) and is wired in via
   * registerFitToScreen; consumers like the zoom menu just call fitToScreen().
   */
  fitToScreen: () => void;
  registerFitToScreen: (fn: () => void) => void;
};

const ZoomContext = createContext<undefined | ZoomContextType>(undefined);

export const ZoomProvider = ({ children }: { children: React.ReactNode }) => {
  const [zoom, setZoom] = useState<number>(1);

  const fitRef = useRef<() => void>(() => {});
  const registerFitToScreen = useCallback((fn: () => void) => {
    fitRef.current = fn;
  }, []);
  const fitToScreen = useCallback(() => {
    fitRef.current();
  }, []);

  const contextValue = useMemo(
    () => ({
      zoom,
      setZoom,
      fitToScreen,
      registerFitToScreen,
    }),
    [zoom, fitToScreen, registerFitToScreen]
  );

  return (
    <ZoomContext.Provider value={contextValue}>{children}</ZoomContext.Provider>
  );
};

export { ZoomContext };
