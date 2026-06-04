import { useContext } from "react";
import { PixelPerfectContext } from "./PixelPerfectContext";

export const usePixelPerfect = () => {
  const context = useContext(PixelPerfectContext);
  if (!context)
    throw new Error("usePixelPerfect must be inside <PixelPerfectProvider>");
  return context;
};
