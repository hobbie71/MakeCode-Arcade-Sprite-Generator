import { useContext } from "react";
import { MouseCoordinatesContext } from "./MouseCoordinatesContext";

export const useMouseCoordinates = () => {
  const context = useContext(MouseCoordinatesContext);

  if (!context)
    throw new Error(
      "useMouseCoordinates must be used within a MouseCoordinatesProvider"
    );

  return context;
};
