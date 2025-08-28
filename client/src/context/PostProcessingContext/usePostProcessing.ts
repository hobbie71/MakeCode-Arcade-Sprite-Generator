import { useContext } from "react";
import PostProcessingContext from "./PostProcessingContext";

export const usePostProcessing = () => {
  const context = useContext(PostProcessingContext);
  if (!context) {
    throw new Error(
      "usePostProcessing must be used within a PostProcessingProvider"
    );
  }
  return context;
};
