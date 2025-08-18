import { useContext } from "react";
import { ZoomContext } from "./ZoomContext";

export const useZoom = () => {
  const context = useContext(ZoomContext);
  if (!context) throw new Error("useZoom must be inside <ZoomProvider>");
  return context;
};
