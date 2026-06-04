import { useContext } from "react";
import { ShapeModeContext } from "./ShapeModeContext";

export const useShapeMode = () => {
  const context = useContext(ShapeModeContext);
  if (!context)
    throw new Error("useShapeMode must be inside <ShapeModeProvider>");
  return context;
};
