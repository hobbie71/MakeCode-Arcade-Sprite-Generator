import React, { createContext, useState } from "react";
import type { ReactNode } from "react";

type ImageImportContextType = {
  importedImage: File | null;
  setImportedImage: (file: File) => void;
};

const ImageImportContext = createContext<ImageImportContextType | undefined>(
  undefined
);

interface ImageImportProviderProps {
  children: ReactNode;
}

export const ImageImportProvider: React.FC<ImageImportProviderProps> = ({
  children,
}) => {
  const [importedImage, setImportedImage] = useState<File | null>(null);

  const value = {
    importedImage,
    setImportedImage,
  };

  return (
    <ImageImportContext.Provider value={value}>
      {children}
    </ImageImportContext.Provider>
  );
};

export default ImageImportContext;
