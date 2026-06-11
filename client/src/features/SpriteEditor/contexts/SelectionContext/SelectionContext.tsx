import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useSprite } from "../../../../context/SpriteContext/useSprite";
import { useCanvasSize } from "../../../../context/CanvasSizeContext/useCanvasSize";
import { useHistory } from "../HistoryContext/useHistory";
import { useToolSelected } from "../ToolSelectedContext/useToolSelected";
import { EditorTools } from "../../../../types/tools";
import { MakeCodeColor } from "../../../../types/color";
import type { Coordinates } from "../../../../types/pixel";
import {
  combineMasks,
  createMask,
  fullMask,
  maskBounds,
  maskGet,
  maskIsEmpty,
  maskSet,
} from "../../libs/selectionMask";
import type {
  MaskBounds,
  MaskCombineMode,
  SelectionMask,
} from "../../libs/selectionMask";
import {
  deriveFloatingPixels,
  rotateData90,
  rotateMask90,
} from "../../libs/selectionTransform";
import {
  cropMaskedRegion,
  regionToImgLiteral,
} from "../../libs/serializeSpriteRegion";
import { setSelectionInterruptListener } from "../../libs/selectionInterrupt";

/**
 * Selection state machine (ADR-0007): idle → drawing (a marquee/lasso draft is
 * in flight) → selected (a mask exists; pixels still live in the sprite) →
 * floating (lifted pixels hovering at an offset). Selecting alone never
 * mutates the sprite; the lift is lazy — it happens on the first move, nudge,
 * resize, or flip.
 */
export type SelectionPhase = "idle" | "drawing" | "selected" | "floating";

export type SelectionDraft =
  | { kind: "rect"; anchor: Coordinates; head: Coordinates }
  | { kind: "lasso"; path: Coordinates[] };

/** Doc-space placement of the floating buffer; w/h ≥ 1. */
export interface FloatRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface FloatingSelection {
  /**
   * The pixels as originally lifted (TRANSPARENT outside the mask), plus the
   * local-space mask of which cells belong to the selection. Resizes always
   * re-sample from this basis so repeated resizes never compound (MakeCode's
   * originalImage trick); flips/rotations fold into it.
   */
  basisData: MakeCodeColor[][];
  basisMask: SelectionMask;
  rect: FloatRect;
  flipX: boolean;
  flipY: boolean;
}

type SelectionContextType = {
  phase: SelectionPhase;
  /** Doc-space selection mask; non-null exactly when phase is "selected". */
  mask: SelectionMask | null;
  /** In-flight tool draft; non-null exactly when phase is "drawing". */
  draft: SelectionDraft | null;
  floating: FloatingSelection | null;
  /** The floating pixels as currently rendered (local coords). */
  floatingPixels: { data: MakeCodeColor[][]; mask: SelectionMask } | null;
  /** Tight bounds of the selection or floating rect — null when idle/drawing. */
  bounds: MaskBounds | null;

  beginDraft: (draft: SelectionDraft) => void;
  updateDraft: (draft: SelectionDraft) => void;
  /** Resolve the draft into the selection, honoring Shift-add / Alt-subtract. */
  commitDraftAsMask: (incoming: SelectionMask, combine: MaskCombineMode) => void;
  /** Drop any draft + mask without touching sprite data (deselect). */
  clearSelection: () => void;

  /**
   * Cut the masked pixels out of the sprite into the floating buffer (no
   * history entry — the commit snapshots the whole chain). No-op when already
   * floating. Returns the float rect so gestures can compute grab offsets
   * synchronously.
   */
  liftSelection: () => FloatRect | null;
  setFloatingPosition: (x: number, y: number) => void;
  /** Resize the float: rect + flip flags (handle drags). */
  setFloatingTransform: (rect: FloatRect, flipX: boolean, flipY: boolean) => void;
  /** Flip / rotate the float in place; lifts first if only selected. */
  flipHorizontal: () => void;
  flipVertical: () => void;
  /** Rotate 90° clockwise. */
  rotate90: () => void;
  /** Rotate 90° counter-clockwise. */
  rotate90CCW: () => void;
  /** Merge the float into the sprite where it sits; ONE history entry. */
  commitFloating: () => void;
  /** Esc: restore the lifted pixels to their origin; no history entry. */
  cancelFloating: () => void;
  /** Delete selected pixels (keeps the mask) or discard the float (one entry). */
  deleteSelection: () => void;
  /** Move the selection 1+ pixels; lifts first if needed. */
  nudge: (dx: number, dy: number) => void;
  /** Select the whole canvas. */
  selectAll: () => void;
  /** Invert the selection within the canvas (no selection → select all). */
  invertSelection: () => void;
  /** Copy the selection (or float) to the system clipboard as an img literal. */
  copySelection: () => void;
  /** Copy then delete. */
  cutSelection: () => void;
  /** Paste a grid as a new floating selection (in-place if it's our own copy,
   *  else centered). */
  pasteAsFloating: (data: MakeCodeColor[][], sourceText?: string) => void;
};

const SelectionContext = createContext<undefined | SelectionContextType>(
  undefined
);

const clone = (data: MakeCodeColor[][]): MakeCodeColor[][] =>
  data.map((row) => [...row]);

export const SelectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { spriteData, setSpriteData } = useSprite();
  const { width, height } = useCanvasSize();
  const { pushSnapshot } = useHistory();
  const { tool } = useToolSelected();

  const [mask, setMask] = useState<SelectionMask | null>(null);
  const [draft, setDraft] = useState<SelectionDraft | null>(null);
  const [floating, setFloating] = useState<FloatingSelection | null>(null);

  // Cancel needs the pre-lift world; null when the float came from a paste.
  const preLiftDataRef = useRef<MakeCodeColor[][] | null>(null);
  const preLiftMaskRef = useRef<SelectionMask | null>(null);
  // Distinguishes our own sprite writes from external ones (undo, modals,
  // imports) — external writes hard-reset the selection.
  const internalWriteRef = useRef(false);
  // Remembers the last copy/cut so a paste of our own clip lands in place.
  const lastCopyRef = useRef<{ text: string; x: number; y: number } | null>(
    null
  );

  const phase: SelectionPhase = floating
    ? "floating"
    : draft
      ? "drawing"
      : mask
        ? "selected"
        : "idle";

  // Render pixels are always re-derived from the basis at the current rect
  // size + flips — never from a previous render — so repeated resizes don't
  // compound. A 1:1 unflipped float derives to a copy of the basis.
  const floatingPixels = useMemo(() => {
    if (!floating) return null;
    return deriveFloatingPixels(
      floating.basisData,
      floating.basisMask,
      floating.rect.w,
      floating.rect.h,
      floating.flipX,
      floating.flipY
    );
  }, [floating]);

  const bounds = useMemo<MaskBounds | null>(() => {
    if (floating) {
      const { x, y, w, h } = floating.rect;
      return { minX: x, minY: y, maxX: x + w - 1, maxY: y + h - 1 };
    }
    return mask ? maskBounds(mask) : null;
  }, [floating, mask]);

  const writeSprite = useCallback(
    (data: MakeCodeColor[][]) => {
      internalWriteRef.current = true;
      setSpriteData(data);
    },
    [setSpriteData]
  );

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

  const hardReset = useCallback(() => {
    setDraft(null);
    setMask(null);
    setFloating(null);
    preLiftDataRef.current = null;
    preLiftMaskRef.current = null;
  }, []);

  const liftSelection = useCallback((): FloatRect | null => {
    if (floating) return floating.rect;
    if (!mask) return null;
    const b = maskBounds(mask);
    if (!b) return null;

    const w0 = b.maxX - b.minX + 1;
    const h0 = b.maxY - b.minY + 1;
    const basisMask = createMask(w0, h0);
    const basisData: MakeCodeColor[][] = [];
    const cut = clone(spriteData);
    for (let y = 0; y < h0; y++) {
      const row: MakeCodeColor[] = [];
      for (let x = 0; x < w0; x++) {
        const sx = b.minX + x;
        const sy = b.minY + y;
        if (maskGet(mask, sx, sy)) {
          maskSet(basisMask, x, y, true);
          row.push(spriteData[sy]?.[sx] ?? MakeCodeColor.TRANSPARENT);
          if (cut[sy]) cut[sy][sx] = MakeCodeColor.TRANSPARENT;
        } else {
          row.push(MakeCodeColor.TRANSPARENT);
        }
      }
      basisData.push(row);
    }

    preLiftDataRef.current = clone(spriteData);
    preLiftMaskRef.current = mask;
    // Intentionally NOT snapshotted: lift → moves → commit is one undo entry
    // (ADR-0007 decision 3); the pre-lift state is already history's top.
    writeSprite(cut);

    const rect: FloatRect = { x: b.minX, y: b.minY, w: w0, h: h0 };
    setFloating({ basisData, basisMask, rect, flipX: false, flipY: false });
    setMask(null);
    return rect;
  }, [floating, mask, spriteData, writeSprite]);

  const setFloatingPosition = useCallback((x: number, y: number) => {
    setFloating((prev) =>
      prev ? { ...prev, rect: { ...prev.rect, x, y } } : prev
    );
  }, []);

  const setFloatingTransform = useCallback(
    (rect: FloatRect, flipX: boolean, flipY: boolean) => {
      setFloating((prev) => (prev ? { ...prev, rect, flipX, flipY } : prev));
    },
    []
  );

  // Flip H/V toggle the derive flags (cheap, composes with any resize); a
  // selection lifts lazily first. liftSelection's setFloating and the toggle
  // below are functional updates, so they compose in order within one batch.
  const flipHorizontal = useCallback(() => {
    if (!floating && !liftSelection()) return;
    setFloating((prev) => (prev ? { ...prev, flipX: !prev.flipX } : prev));
  }, [floating, liftSelection]);

  const flipVertical = useCallback(() => {
    if (!floating && !liftSelection()) return;
    setFloating((prev) => (prev ? { ...prev, flipY: !prev.flipY } : prev));
  }, [floating, liftSelection]);

  // Rotate folds into the basis (a 90° turn isn't expressible as a flip) and
  // swaps the rect's w/h around its center so the turn pivots in place. CCW is
  // three CW quarter-turns — net dimensions still swap once either way, so the
  // rect handling is identical regardless of direction.
  const rotate = useCallback(
    (ccw: boolean) => {
      if (!floating && !liftSelection()) return;
      setFloating((prev) => {
        if (!prev) return prev;
        const cx = prev.rect.x + prev.rect.w / 2;
        const cy = prev.rect.y + prev.rect.h / 2;
        const newW = prev.rect.h;
        const newH = prev.rect.w;
        let basisData = prev.basisData;
        let basisMask = prev.basisMask;
        for (let i = 0; i < (ccw ? 3 : 1); i++) {
          basisData = rotateData90(basisData);
          basisMask = rotateMask90(basisMask);
        }
        return {
          ...prev,
          basisData,
          basisMask,
          rect: {
            x: Math.round(cx - newW / 2),
            y: Math.round(cy - newH / 2),
            w: newW,
            h: newH,
          },
        };
      });
    },
    [floating, liftSelection]
  );
  const rotate90 = useCallback(() => rotate(false), [rotate]); // clockwise
  const rotate90CCW = useCallback(() => rotate(true), [rotate]); // counter-cw

  const commitFloating = useCallback(() => {
    if (!floating || !floatingPixels) return;
    const merged = clone(spriteData);
    const docMask = createMask(width, height);
    const { data, mask: localMask } = floatingPixels;
    const { x: ox, y: oy } = floating.rect;

    for (let y = 0; y < data.length; y++) {
      for (let x = 0; x < (data[y]?.length ?? 0); x++) {
        if (!maskGet(localMask, x, y)) continue;
        const dx = ox + x;
        const dy = oy + y;
        // Off-canvas cells are clipped on commit (MakeCode behavior).
        if (dx < 0 || dy < 0 || dx >= width || dy >= height) continue;
        maskSet(docMask, dx, dy, true);
        const color = data[y][x];
        // Transparent apply: transparent float cells don't punch holes.
        if (color !== MakeCodeColor.TRANSPARENT) merged[dy][dx] = color;
      }
    }

    writeSprite(merged);
    pushSnapshot(merged);
    setFloating(null);
    preLiftDataRef.current = null;
    preLiftMaskRef.current = null;
    // The committed region stays selected so it can be re-grabbed.
    setMask(maskIsEmpty(docMask) ? null : docMask);
  }, [
    floating,
    floatingPixels,
    spriteData,
    width,
    height,
    writeSprite,
    pushSnapshot,
  ]);

  const cancelFloating = useCallback(() => {
    if (!floating) return;
    if (preLiftDataRef.current) writeSprite(clone(preLiftDataRef.current));
    // Restore the selection where it was lifted from (paste floats have none).
    setMask(preLiftMaskRef.current);
    setFloating(null);
    preLiftDataRef.current = null;
    preLiftMaskRef.current = null;
  }, [floating, writeSprite]);

  const deleteSelection = useCallback(() => {
    if (floating) {
      // The lift already left the hole; deleting just discards the buffer and
      // commits the hole as one entry.
      pushSnapshot(spriteData);
      setFloating(null);
      preLiftDataRef.current = null;
      preLiftMaskRef.current = null;
      setMask(null);
      return;
    }
    if (!mask) return;
    const next = clone(spriteData);
    let changed = false;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (!maskGet(mask, x, y)) continue;
        if (next[y]?.[x] !== MakeCodeColor.TRANSPARENT) {
          next[y][x] = MakeCodeColor.TRANSPARENT;
          changed = true;
        }
      }
    }
    if (!changed) return;
    writeSprite(next);
    pushSnapshot(next);
    // Keep the mask — the cleared region stays selected (Aseprite behavior).
  }, [floating, mask, spriteData, width, height, writeSprite, pushSnapshot]);

  const nudge = useCallback(
    (dx: number, dy: number) => {
      if (floating) {
        setFloatingPosition(floating.rect.x + dx, floating.rect.y + dy);
        return;
      }
      if (!mask) return;
      const rect = liftSelection();
      if (!rect) return;
      // Queued after the lift's setFloating, so prev is the fresh float.
      setFloating((prev) =>
        prev
          ? { ...prev, rect: { ...prev.rect, x: rect.x + dx, y: rect.y + dy } }
          : prev
      );
    },
    [floating, mask, liftSelection, setFloatingPosition]
  );

  const selectAll = useCallback(() => {
    setDraft(null);
    setFloating(null);
    setMask(fullMask(width, height));
  }, [width, height]);

  const invertSelection = useCallback(() => {
    if (floating) return; // can't invert a lifted float
    if (!mask) {
      setMask(fullMask(width, height)); // invert of nothing = everything
      return;
    }
    const next = createMask(width, height);
    for (let i = 0; i < next.bits.length; i++) {
      next.bits[i] = mask.bits[i] === 1 ? 0 : 1;
    }
    setMask(maskIsEmpty(next) ? null : next);
  }, [floating, mask, width, height]);

  /** The region grid + its doc origin for the current selection or float. */
  const currentRegion = useCallback((): {
    region: MakeCodeColor[][];
    x: number;
    y: number;
  } | null => {
    if (floatingPixels && floating) {
      return {
        region: floatingPixels.data,
        x: floating.rect.x,
        y: floating.rect.y,
      };
    }
    if (mask) {
      const region = cropMaskedRegion(spriteData, mask);
      const b = maskBounds(mask);
      if (region && b) return { region, x: b.minX, y: b.minY };
    }
    return null;
  }, [floatingPixels, floating, mask, spriteData]);

  const copySelection = useCallback(() => {
    const r = currentRegion();
    if (!r) return;
    const text = regionToImgLiteral(r.region);
    lastCopyRef.current = { text, x: r.x, y: r.y };
    void navigator.clipboard?.writeText(text).catch(() => {});
  }, [currentRegion]);

  const cutSelection = useCallback(() => {
    copySelection();
    deleteSelection();
  }, [copySelection, deleteSelection]);

  const pasteAsFloating = useCallback(
    (data: MakeCodeColor[][], sourceText?: string) => {
      const h = data.length;
      const w = data[0]?.length ?? 0;
      if (w === 0 || h === 0) return;
      if (floating) commitFloating();

      // The whole pasted rectangle is selected; transparent cells simply don't
      // paint on commit (transparent apply), so the bounding box stays grabbable.
      const basisMask = fullMask(w, h);

      // Land in place if this is our own clip and it still fits; else center.
      let x = Math.floor((width - w) / 2);
      let y = Math.floor((height - h) / 2);
      const last = lastCopyRef.current;
      if (last && sourceText && sourceText === last.text) {
        x = last.x;
        y = last.y;
      }

      preLiftDataRef.current = null; // a paste float has nothing to restore
      preLiftMaskRef.current = null;
      setMask(null);
      setDraft(null);
      setFloating({
        basisData: data.map((row) => [...row]),
        basisMask,
        rect: { x, y, w, h },
        flipX: false,
        flipY: false,
      });
    },
    [floating, commitFloating, width, height]
  );

  // ---- Lifecycle guards -------------------------------------------------

  const floatingRef = useRef(floating);
  floatingRef.current = floating;
  const commitFloatingRef = useRef(commitFloating);
  commitFloatingRef.current = commitFloating;
  const cancelFloatingRef = useRef(cancelFloating);
  cancelFloatingRef.current = cancelFloating;

  // Switching to a non-Select tool commits a float (selection is move-only;
  // drawing happens on the merged result), then deselects.
  useEffect(() => {
    if (tool === EditorTools.Select) return;
    if (floatingRef.current) commitFloatingRef.current();
    setDraft(null);
    setMask(null);
  }, [tool]);

  // External sprite writes (undo/redo, modals committing new grids, imports)
  // invalidate selection state wholesale — hard reset, never restore.
  const prevSpriteRef = useRef(spriteData);
  useEffect(() => {
    if (prevSpriteRef.current === spriteData) return;
    prevSpriteRef.current = spriteData;
    if (internalWriteRef.current) {
      internalWriteRef.current = false;
      return;
    }
    hardReset();
  }, [spriteData, hardReset]);

  // Canvas dimension changes invalidate the mask coordinate space entirely.
  useEffect(() => {
    hardReset();
  }, [width, height, hardReset]);

  // Modal opens (Generate / Resize & Process / Export — wired in StudioPage)
  // cancel an in-flight float so modals always see the unmoved sprite.
  useEffect(() => {
    setSelectionInterruptListener(() => cancelFloatingRef.current());
    return () => setSelectionInterruptListener(null);
  }, []);

  const contextValue = useMemo(
    () => ({
      phase,
      mask,
      draft,
      floating,
      floatingPixels,
      bounds,
      beginDraft,
      updateDraft,
      commitDraftAsMask,
      clearSelection,
      liftSelection,
      setFloatingPosition,
      setFloatingTransform,
      flipHorizontal,
      flipVertical,
      rotate90,
      rotate90CCW,
      commitFloating,
      cancelFloating,
      deleteSelection,
      nudge,
      selectAll,
      invertSelection,
      copySelection,
      cutSelection,
      pasteAsFloating,
    }),
    [
      phase,
      mask,
      draft,
      floating,
      floatingPixels,
      bounds,
      beginDraft,
      updateDraft,
      commitDraftAsMask,
      clearSelection,
      liftSelection,
      setFloatingPosition,
      setFloatingTransform,
      flipHorizontal,
      flipVertical,
      rotate90,
      rotate90CCW,
      commitFloating,
      cancelFloating,
      deleteSelection,
      nudge,
      selectAll,
      invertSelection,
      copySelection,
      cutSelection,
      pasteAsFloating,
    ]
  );

  return (
    <SelectionContext.Provider value={contextValue}>
      {children}
    </SelectionContext.Provider>
  );
};

export { SelectionContext };
