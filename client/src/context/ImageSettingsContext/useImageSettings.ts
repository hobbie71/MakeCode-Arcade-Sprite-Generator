import { useContext } from "react";
import ImageSettingsContext from "./ImageSettingsContext";

export const useImageSettings = () => {
  const context = useContext(ImageSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useImageSettings must be used within an ImageSettingsProvider"
    );
  }
  return context;
};
