import React, { createContext, useState, ReactNode } from "react";

interface ImageImportState {
  importCanvas: HTMLCanvasElement | null;
  importVersion: number;
}

interface ImageImportActions {
  setImportCanvas: (canvas: HTMLCanvasElement | null) => void;
  incrementVersion: () => void;
}

type ImageImportContextType = ImageImportState & ImageImportActions;

const ImageImportContext = createContext<ImageImportContextType | undefined>(
  undefined
);

interface ImageImportProviderProps {
  children: ReactNode;
}

export const ImageImportProvider: React.FC<ImageImportProviderProps> = ({
  children,
}) => {
  const [importCanvas, setImportCanvas] = useState<HTMLCanvasElement | null>(
    null
  );
  const [importVersion, setImportVersion] = useState(0);

  const incrementVersion = () => setImportVersion((v) => v + 1);

  const value = {
    importCanvas,
    importVersion,
    setImportCanvas,
    incrementVersion,
  };

  return (
    <ImageImportContext.Provider value={value}>
      {children}
    </ImageImportContext.Provider>
  );
};

export default ImageImportContext;
