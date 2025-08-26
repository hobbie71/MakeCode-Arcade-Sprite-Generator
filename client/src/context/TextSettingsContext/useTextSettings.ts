import { useContext } from "react";
import TextSettingsContext from "./TextSettingsContext";

export const useTextSettings = () => {
  const context = useContext(TextSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useTextSettings must be used within a TextSettingsProvider"
    );
  }
  return context;
};
