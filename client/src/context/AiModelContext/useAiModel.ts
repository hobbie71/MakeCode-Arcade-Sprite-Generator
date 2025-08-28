import { useContext } from "react";
import AiModelContext from "./AiModelContext";

export const useAiModel = () => {
  const context = useContext(AiModelContext);
  if (context === undefined) {
    throw new Error("useAiModel must be used within a AiModelProvider");
  }
  return context;
};
