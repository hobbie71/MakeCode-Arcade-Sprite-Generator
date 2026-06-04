import { useCallback } from "react";

import type { Coordinates } from "../../../types/pixel";
import { useSelectionArea } from "../contexts/SelectionArea/useSelectionArea";

/**
 * Select (marquee) tool. Press-drag defines a rectangular selection; the live
 * rectangle is drawn by <SelectionOverlay>, which reads SelectionArea and is
 * positioned in the canvas's transformed coordinate frame so it tracks zoom/pan.
 */
export const useSelect = () => {
  const { setSelectionArea } = useSelectionArea();

  const handlePointerDown = useCallback(
    (coordinates: Coordinates) => {
      // Start a fresh selection anchored at the press point.
      setSelectionArea({ start: coordinates, end: coordinates });
    },
    [setSelectionArea]
  );

  const handlePointerMove = useCallback(
    (coordinates: Coordinates) => {
      setSelectionArea((prev) =>
        prev ? { ...prev, end: coordinates } : { start: coordinates, end: coordinates }
      );
    },
    [setSelectionArea]
  );

  const handlePointerUp = useCallback(
    (coordinates: Coordinates) => {
      setSelectionArea((prev) =>
        prev ? { ...prev, end: coordinates } : { start: coordinates, end: coordinates }
      );
    },
    [setSelectionArea]
  );

  return { handlePointerDown, handlePointerMove, handlePointerUp };
};
