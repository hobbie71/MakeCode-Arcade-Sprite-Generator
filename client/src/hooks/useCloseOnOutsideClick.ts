import { useEffect, useRef, type RefObject } from "react";

/** While `active`, calls `onOutside` on any mousedown outside `ref` — the
    shared dismiss behavior behind popover-style widgets (dropdowns, menus). */
export const useCloseOnOutsideClick = (
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onOutside: () => void
) => {
  // Track the latest callback so the listener isn't re-subscribed every render
  // (callers typically pass an inline arrow).
  const onOutsideRef = useRef(onOutside);
  useEffect(() => {
    onOutsideRef.current = onOutside;
  }, [onOutside]);

  useEffect(() => {
    if (!active) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        onOutsideRef.current();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [active, ref]);
};
