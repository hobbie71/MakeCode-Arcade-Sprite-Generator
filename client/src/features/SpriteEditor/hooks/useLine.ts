import { useCallback } from "react";
import { Coordinates } from "@/types/pixel";

export const useLine = () => {
  // Add line tool logic here
  const handlePointerDown = useCallback((coordinates: Coordinates) => {}, []);
  const handlePointerMove = useCallback((coordinates: Coordinates) => {}, []);
  const handlePointerUp = useCallback((coordinates: Coordinates) => {}, []);

  return { handlePointerDown, handlePointerMove, handlePointerUp };
};
