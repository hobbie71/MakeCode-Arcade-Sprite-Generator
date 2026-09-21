import React, { createContext, useCallback, useState } from "react";
import type { ReactNode } from "react";

import type { SourceFrame } from "../../features/InputSection/utils/sourceFrame";

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
  /** Also clears `sourceFrame`: a frame only ever belongs to the file it was cut from. */
  setSourceImage: (file: File | null) => void;
  /**
   * The region of `sourceImage` the last processing run mapped onto the sprite
   * canvas. Null until the source has been processed at least once.
   */
  sourceFrame: SourceFrame | null;
  setSourceFrame: (frame: SourceFrame | null) => void;
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
  const [sourceImage, setSourceImageState] = useState<File | null>(null);
  const [sourceFrame, setSourceFrame] = useState<SourceFrame | null>(null);

  const setSourceImage = useCallback((file: File | null) => {
    setSourceImageState(file);
    setSourceFrame(null);
  }, []);

  const value = {
    importedImage,
    setImportedImage,
    sourceImage,
    setSourceImage,
    sourceFrame,
    setSourceFrame,
  };

  return (
    <ImageImportContext.Provider value={value}>
      {children}
    </ImageImportContext.Provider>
  );
};

export default ImageImportContext;
