import { useContext } from "react";
import GenerationMethodContext from "./GenerationMethodContext";

export const useGenerationMethod = () => {
  const context = useContext(GenerationMethodContext);
  if (context === undefined) {
    throw new Error(
      "useGenerationMethod must be used within a GenerationMethodProvider"
    );
  }
  return context;
};
