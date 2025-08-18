import { createContext, useState, useMemo } from "react";

type ZoomContextType = {
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
};

const ZoomContext = createContext<undefined | ZoomContextType>(undefined);

export const ZoomProvider = ({ children }: { children: React.ReactNode }) => {
  const [zoom, setZoom] = useState<number>(1);

  const contextValue = useMemo(
    () => ({
      zoom,
      setZoom,
    }),
    [zoom]
  );

  return (
    <ZoomContext.Provider value={contextValue}>{children}</ZoomContext.Provider>
  );
};

export { ZoomContext };
