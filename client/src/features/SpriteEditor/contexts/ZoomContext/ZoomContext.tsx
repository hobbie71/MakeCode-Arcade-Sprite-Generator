import { createContext, useState } from "react";

type ZoomContextType = {
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
};

const ZoomContext = createContext<undefined | ZoomContextType>(undefined);

export const ZoomProvider = ({ children }: { children: React.ReactNode }) => {
  const [zoom, setZoom] = useState<number>(1);

  return (
    <ZoomContext.Provider value={{ zoom, setZoom }}>
      {children}
    </ZoomContext.Provider>
  );
};

export { ZoomContext };
