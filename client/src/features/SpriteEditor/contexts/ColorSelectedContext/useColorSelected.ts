import { useContext } from "react";
import { ColorSelectedContext } from "./ColorSelectedContext";

export const useColorSelected = () => {
  const context = useContext(ColorSelectedContext);
  if (!context)
    throw new Error("useColorSelected must be inside <ColorSelectedProvider>");
  return context;
};
