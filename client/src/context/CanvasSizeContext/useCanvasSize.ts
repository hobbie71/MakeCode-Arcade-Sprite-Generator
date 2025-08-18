import { useContext } from "react";
import { CanvasSizeContext } from "./CanvasSizeContext";

export const useCanvasSize = () => {
  const context = useContext(CanvasSizeContext);
  if (!context)
    throw new Error("useCanvasSize must be inside <CanvasSizeProvider>");
  return context;
};
