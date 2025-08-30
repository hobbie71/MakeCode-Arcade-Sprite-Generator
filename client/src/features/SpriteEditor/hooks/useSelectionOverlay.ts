import { useCallback, useRef, useEffect } from "react";

// Context imports
import { useSelectionArea } from "../contexts/SelectionArea/useSelectionArea";
import { useSprite } from "../../../context/SpriteContext/useSprite";

// Lib imports
import { getSelectedSpriteData } from "../libs/getSelectedSpriteData";

// Util import
// import { isPointerInSelection } from "../libs/isPointerInSelection";

// Type imports
import type { Coordinates, SelectionArea } from "../../../types/pixel";
import { MakeCodeColor } from "../../../types/color";

export const useSelectionOverlay = () => {
  // Hooks
  const { selectionArea, setSelectionArea } = useSelectionArea();
  const { spriteData } = useSprite();

  // Refs
  const selectedSpriteData = useRef<MakeCodeColor[][]>([[]]);
  const selectionAreaRef = useRef<SelectionArea>(selectionArea);

  useEffect(() => {
    selectionAreaRef.current = selectionArea;
  }, [selectionArea]);

  const setStartOverlay = useCallback(
    (startCoordinates: Coordinates) => {
      setSelectionArea((prevArea) => {
        if (prevArea) {
          return { ...prevArea, start: startCoordinates };
        } else {
          return { start: startCoordinates, end: startCoordinates };
        }
      });
    },
    [setSelectionArea]
  );

  const setEndOverlay = useCallback(
    (endCoordinates: Coordinates) => {
      const currentArea = selectionAreaRef.current;

      // Only proceed if end coordinates are different from the previous end coordinates
      if (
        currentArea &&
        currentArea.end.x === endCoordinates.x &&
        currentArea.end.y === endCoordinates.y
      ) {
        return;
      }

      setSelectionArea((prevArea) =>
        prevArea ? { ...prevArea, end: endCoordinates } : null
      );

      if (!currentArea) return;

      const updatedArea = { ...currentArea, end: endCoordinates };
      selectedSpriteData.current = getSelectedSpriteData(
        spriteData,
        updatedArea
      );
    },
    [setSelectionArea, spriteData]
  );

  const resetSelectionAreaIfOutOfArea = useCallback(() => {
    if (!selectionArea) return;

    // if (!isPointerInSelection())
  }, [selectionArea]);

  // TODO: Implement moveOverlay functionality
  // const moveOverlay = useCallback(() => {}, []);

  return { setStartOverlay, setEndOverlay, resetSelectionAreaIfOutOfArea };
};
