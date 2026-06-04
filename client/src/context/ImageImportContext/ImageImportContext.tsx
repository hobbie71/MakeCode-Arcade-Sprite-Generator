import React, { createContext, useState } from "react";
import type { ReactNode } from "react";

type ImageImportContextType = {
  importedImage: File | null;
  setImportedImage: (file: File) => void;
  /**
   * The cached ORIGINAL generated/uploaded image. Set once per generate/upload
   * and never overwritten by re-processing. The Resize & Process modal
   * re-processes from this, so re-sizing is free (no new AI call), and the
   * studio gates the Resize action on `sourceImage != null`.
   */
  sourceImage: File | null;
  setSourceImage: (file: File | null) => void;
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
  const [sourceImage, setSourceImage] = useState<File | null>(null);

  const value = {
    importedImage,
    setImportedImage,
    sourceImage,
    setSourceImage,
  };

  return (
    <ImageImportContext.Provider value={value}>
      {children}
    </ImageImportContext.Provider>
  );
};

export default ImageImportContext;
