import { useContext } from "react";
import { SelectionAreaContext } from "./SelectionAreaContext";

export const useSelectionArea = () => {
  const context = useContext(SelectionAreaContext);
  if (!context)
    throw new Error("useSelectionArea must be inside <SelectionAreaProvider>");
  return context;
};
