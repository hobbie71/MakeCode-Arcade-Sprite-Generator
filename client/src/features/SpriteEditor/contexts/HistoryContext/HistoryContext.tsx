import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useSprite } from "../../../../context/SpriteContext/useSprite";
import { MakeCodeColor } from "../../../../types/color";

type Snapshot = MakeCodeColor[][];

type HistoryContextType = {
  /**
   * Record the given sprite-data state as a committed step. Call this AFTER a
   * change is committed (stroke end, fill, shape, paste) — never mid-drag.
   * Pushing clears the redo stack (standard linear-history behaviour).
   */
  pushSnapshot: (data: Snapshot) => void;
  /** Restore the previous committed state. No-op when there's nothing to undo. */
  undo: () => void;
  /** Re-apply a state that was just undone. No-op when there's nothing to redo. */
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

const HistoryContext = createContext<undefined | HistoryContextType>(undefined);

/** Deep-copy a sprite-data grid so stored snapshots never alias the live ref. */
const clone = (data: Snapshot): Snapshot => data.map((row) => [...row]);

const isEmpty = (data: Snapshot): boolean =>
  !data || data.length === 0 || !data[0] || data[0].length === 0;

export const HistoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { spriteData, setSpriteData } = useSprite();

  // Past = states we can undo *to*; the last entry is the current committed
  // state. Future = states we've undone (available for redo).
  const pastRef = useRef<Snapshot[]>([]);
  const futureRef = useRef<Snapshot[]>([]);
  const seededRef = useRef(false);

  // Mirror stack depth into state so buttons can enable/disable reactively.
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const syncFlags = useCallback(() => {
    setCanUndo(pastRef.current.length > 1);
    setCanRedo(futureRef.current.length > 0);
  }, []);

  // Seed the baseline once the canvas has a real (non-empty) initial state, so
  // the user's first edit is undoable back to the starting canvas.
  useEffect(() => {
    if (seededRef.current) return;
    if (isEmpty(spriteData)) return;
    pastRef.current = [clone(spriteData)];
    seededRef.current = true;
  }, [spriteData]);

  const pushSnapshot = useCallback(
    (data: Snapshot) => {
      if (isEmpty(data)) return;

      const snapshot = clone(data);

      // Skip no-op commits (identical to the current top of the stack) so a
      // pointer-up that didn't actually change anything doesn't pollute history.
      const top = pastRef.current[pastRef.current.length - 1];
      if (top && JSON.stringify(top) === JSON.stringify(snapshot)) return;

      pastRef.current.push(snapshot);
      futureRef.current = [];
      syncFlags();
    },
    [syncFlags]
  );

  const undo = useCallback(() => {
    // Need at least 2 entries: the current state + the one to restore.
    if (pastRef.current.length < 2) return;

    const current = pastRef.current.pop()!;
    futureRef.current.push(current);

    const previous = pastRef.current[pastRef.current.length - 1];
    setSpriteData(clone(previous));
    syncFlags();
  }, [setSpriteData, syncFlags]);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;

    const next = futureRef.current.pop()!;
    pastRef.current.push(next);
    setSpriteData(clone(next));
    syncFlags();
  }, [setSpriteData, syncFlags]);

  const contextValue = useMemo(
    () => ({ pushSnapshot, undo, redo, canUndo, canRedo }),
    [pushSnapshot, undo, redo, canUndo, canRedo]
  );

  return (
    <HistoryContext.Provider value={contextValue}>
      {children}
    </HistoryContext.Provider>
  );
};

export { HistoryContext };
