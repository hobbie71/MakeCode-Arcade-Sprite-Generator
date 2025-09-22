import { useCallback, useRef } from "react";

// Context imports
import { useToolSelected } from "../contexts/ToolSelectedContext/useToolSelected";

// Type imports
import type { Coordinates } from "../../../types/pixel";
import { EditorTools } from "../../../types/tools";

export const usePan = (
  offset: Coordinates,
  setOffset: (offset: Coordinates) => void
) => {
  const { tool } = useToolSelected();

  // Refs
  const lastPanPosition = useRef<Coordinates | null>(null);
  const isMouseDown = useRef<boolean>(false);

  const handlePointerDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (tool !== EditorTools.Pan) return;

      lastPanPosition.current = { x: e.clientX, y: e.clientY };
      isMouseDown.current = true;

      // Update mouse style
      if (e.currentTarget.style.cursor === "grab") {
        e.currentTarget.style.cursor = "grabbing";
      }
    },
    [tool]
  );
  const handlePointerMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (
        tool !== EditorTools.Pan ||
        !isMouseDown.current ||
        !lastPanPosition.current
      )
        return;

      const dx = e.clientX - lastPanPosition.current.x;
      const dy = e.clientY - lastPanPosition.current.y;
      setOffset({ x: offset.x + dx, y: offset.y + dy });
      lastPanPosition.current = { x: e.clientX, y: e.clientY };
    },
    [offset, setOffset, tool]
  );
  const handlePointerUp = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (tool !== EditorTools.Pan) return;

      isMouseDown.current = false;

      // Update mouse style
      if (e.currentTarget.style.cursor === "grabbing") {
        e.currentTarget.style.cursor = "grab";
      }
    },
    [tool]
  );

  const handlePointerLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (tool !== EditorTools.Pan) return;

      // Update mouse style
      if (e.currentTarget.style.cursor === "grabbing") {
        e.currentTarget.style.cursor = "grab";
      }

      isMouseDown.current = false;
    },
    [tool]
  );

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerLeave,
  };
};
