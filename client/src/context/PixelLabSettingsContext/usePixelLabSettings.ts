import { useContext } from "react";
import PixelLabSettingsContext from "./PixelLabSettingsContext";

export const usePixelLabSettings = () => {
  const context = useContext(PixelLabSettingsContext);
  if (!context) {
    throw new Error(
      "usePixelLabSettings must be used within a PixelLabSettingsProvider"
    );
  }
  return context;
};
