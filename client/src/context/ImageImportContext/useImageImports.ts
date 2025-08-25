import { useContext } from "react";
import ImageImportContext from "./ImageImportContext";

export const useImageImports = () => {
  const context = useContext(ImageImportContext);
  if (context === undefined) {
    throw new Error(
      "useImageImports must be used within an ImageImportProvider"
    );
  }
  return context;
};
