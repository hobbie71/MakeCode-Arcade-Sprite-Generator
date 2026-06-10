/**
 * Tiny module-level hook so code OUTSIDE the editor's provider tree (StudioPage
 * opens the Generate / Resize & Process / Export modals, including from the
 * nav) can cancel an in-flight floating selection before a modal reads the
 * sprite. Opening a modal mid-float cancels the move — pixels snap home, so
 * modals and exports always see the whole, unmoved sprite (ADR-0007 decision 6).
 */
type Listener = () => void;

let listener: Listener | null = null;

export const setSelectionInterruptListener = (next: Listener | null): void => {
  listener = next;
};

export const interruptSelection = (): void => {
  listener?.();
};
