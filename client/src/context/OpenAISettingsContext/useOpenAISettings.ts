import { useContext } from "react";
import OpenAISettingsContext from "./OpenAISettingsContext";

export const useOpenAISettings = () => {
  const context = useContext(OpenAISettingsContext);
  if (!context) {
    throw new Error(
      "useOpenAISettings must be used within a OpenAISettingsProvider"
    );
  }
  return context;
};
