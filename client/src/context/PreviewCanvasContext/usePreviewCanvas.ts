import { useContext } from "react";
import { PreviewCanvasContext } from "./PreviewCanvasContext";

export const usePreviewCanvas = () => {
  const context = useContext(PreviewCanvasContext);
  if (!context)
    throw new Error("usePreviewCanvas must be inside <PreviewCanvasProvider>");
  return context;
};
