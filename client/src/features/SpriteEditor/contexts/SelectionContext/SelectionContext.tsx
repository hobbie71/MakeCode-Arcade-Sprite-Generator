import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useCanvasSize } from "../../../../context/CanvasSizeContext/useCanvasSize";
import { useToolSelected } from "../ToolSelectedContext/useToolSelected";
import { EditorTools } from "../../../../types/tools";
import type { Coordinates } from "../../../../types/pixel";
import {
  combineMasks,
  maskBounds,
  maskIsEmpty,
} from "../../libs/selectionMask";
import type {
  MaskBounds,
  MaskCombineMode,
  SelectionMask,
} from "../../libs/selectionMask";

/**
 * Selection state machine (ADR-0007): idle → drawing (a marquee/lasso draft is
 * in flight) → selected (a mask exists; pixels still live in the sprite) →
 * floating (lifted pixels hovering at an offset — added in the floating phase).
 * Selecting alone never mutates the sprite; the lift is lazy.
 */
export type SelectionPhase = "idle" | "drawing" | "selected" | "floating";

export type SelectionDraft =
  | { kind: "rect"; anchor: Coordinates; head: Coordinates }
  | { kind: "lasso"; path: Coordinates[] };

type SelectionContextType = {
  phase: SelectionPhase;
  /** Doc-space selection mask; non-null exactly when phase is "selected". */
  mask: SelectionMask | null;
  /** In-flight tool draft; non-null exactly when phase is "drawing". */
  draft: SelectionDraft | null;
  /** Tight bounds of the active selection (mask) — null when idle/drawing. */
  bounds: MaskBounds | null;
  beginDraft: (draft: SelectionDraft) => void;
  updateDraft: (draft: SelectionDraft) => void;
  /** Resolve the draft into the selection, honoring Shift-add / Alt-subtract. */
  commitDraftAsMask: (incoming: SelectionMask, combine: MaskCombineMode) => void;
  /** Drop any draft + mask without touching sprite data (deselect). */
  clearSelection: () => void;
};

const SelectionContext = createContext<undefined | SelectionContextType>(
  undefined
);

export const SelectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { width, height } = useCanvasSize();
  const { tool } = useToolSelected();

  const [mask, setMask] = useState<SelectionMask | null>(null);
  const [draft, setDraft] = useState<SelectionDraft | null>(null);

  const phase: SelectionPhase = draft ? "drawing" : mask ? "selected" : "idle";

  const bounds = useMemo(() => (mask ? maskBounds(mask) : null), [mask]);

  const beginDraft = useCallback((next: SelectionDraft) => setDraft(next), []);
  const updateDraft = useCallback((next: SelectionDraft) => setDraft(next), []);

  const commitDraftAsMask = useCallback(
    (incoming: SelectionMask, combine: MaskCombineMode) => {
      setDraft(null);
      setMask((prev) => {
        const next = combineMasks(prev, incoming, combine);
        return maskIsEmpty(next) ? null : next;
      });
    },
    []
  );

  const clearSelection = useCallback(() => {
    setDraft(null);
    setMask(null);
  }, []);

  // Leaving the Select tool drops the selection (the floating phase will
  // commit a float first — selection is move-only, ADR-0007 decision 5).
  useEffect(() => {
    if (tool !== EditorTools.Select) clearSelection();
  }, [tool, clearSelection]);

  // A canvas dimension change invalidates the mask's coordinate space wholesale
  // (Resize & Process, size inputs). Hard-reset rather than trying to remap.
  useEffect(() => {
    clearSelection();
  }, [width, height, clearSelection]);

  const contextValue = useMemo(
    () => ({
      phase,
      mask,
      draft,
      bounds,
      beginDraft,
      updateDraft,
      commitDraftAsMask,
      clearSelection,
    }),
    [
      phase,
      mask,
      draft,
      bounds,
      beginDraft,
      updateDraft,
      commitDraftAsMask,
      clearSelection,
    ]
  );

  return (
    <SelectionContext.Provider value={contextValue}>
      {children}
    </SelectionContext.Provider>
  );
};

export { SelectionContext };
