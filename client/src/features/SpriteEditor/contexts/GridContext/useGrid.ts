import { useContext } from "react";
import { GridContext } from "./GridContext";

export const useGrid = () => {
  const context = useContext(GridContext);
  if (!context) throw new Error("useGrid must be inside <GridProvider>");
  return context;
};
