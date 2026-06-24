import { useCallback, useRef } from "react";

// Context imports
import { useToolSelected } from "../contexts/ToolSelectedContext/useToolSelected";

// Type imports
import type { Coordinates } from "../../../types/pixel";
import { EditorTools } from "../../../types/tools";

/** Swap the element cursor only when it currently reads `from` — keeps the
 *  grab/grabbing toggle from clobbering a cursor another tool may have set. */
const swapCursor = (
  e: React.PointerEvent<HTMLDivElement>,
  from: string,
  to: string
) => {
  if (e.currentTarget.style.cursor === from) {
    e.currentTarget.style.cursor = to;
  }
};

export const usePan = (
  offset: Coordinates,
  setOffset: (offset: Coordinates) => void
) => {
  const { tool } = useToolSelected();

  // Refs
  const lastPanPosition = useRef<Coordinates | null>(null);
  const isMouseDown = useRef<boolean>(false);

  // A drag only pans on the primary pointer with an anchored start — a second
  // finger resting on the canvas must not re-anchor or move the view.
  const isPanDragging = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) =>
      tool === EditorTools.Pan &&
      e.isPrimary !== false &&
      isMouseDown.current &&
      lastPanPosition.current !== null,
    [tool]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // Primary pointer only: a second finger must not re-anchor the pan.
      if (tool !== EditorTools.Pan || e.isPrimary === false) return;

      lastPanPosition.current = { x: e.clientX, y: e.clientY };
      isMouseDown.current = true;
      swapCursor(e, "grab", "grabbing");
    },
    [tool]
  );
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isPanDragging(e) || !lastPanPosition.current) return;

      const dx = e.clientX - lastPanPosition.current.x;
      const dy = e.clientY - lastPanPosition.current.y;
      setOffset({ x: offset.x + dx, y: offset.y + dy });
      lastPanPosition.current = { x: e.clientX, y: e.clientY };
    },
    [isPanDragging, offset, setOffset]
  );
  const endPan = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (tool !== EditorTools.Pan) return;

      isMouseDown.current = false;
      swapCursor(e, "grabbing", "grab");
    },
    [tool]
  );

  return {
    handlePointerDown,
    handlePointerMove,
    // Up and leave both end the pan and restore the grab cursor.
    handlePointerUp: endPan,
    handlePointerLeave: endPan,
  };
};
