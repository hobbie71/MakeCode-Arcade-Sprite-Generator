import { useRef, useCallback, useEffect } from "react";

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean; // Command key on Mac
  callback: (event: KeyboardEvent) => void;
  preventDefault?: boolean;
}

const isTypingTarget = (target: HTMLElement): boolean =>
  target.tagName === "INPUT" ||
  target.tagName === "TEXTAREA" ||
  target.isContentEditable;

// Each modifier must be held when required and released when not
const matchesShortcut = (
  event: KeyboardEvent,
  shortcut: KeyboardShortcut
): boolean =>
  event.key.toLowerCase() === shortcut.key.toLowerCase() &&
  event.ctrlKey === Boolean(shortcut.ctrl) &&
  event.shiftKey === Boolean(shortcut.shift) &&
  event.altKey === Boolean(shortcut.alt) &&
  event.metaKey === Boolean(shortcut.meta);

export const useKeyboardShortcut = (
  shortcuts: KeyboardShortcut[],
  enabled: boolean = true
) => {
  const shortcutsRef = useRef(shortcuts);

  // Update ref when shortcuts change to avoid stale closures
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when user is typing in an input
    if (isTypingTarget(event.target as HTMLElement)) {
      return;
    }

    shortcutsRef.current.forEach((shortcut) => {
      if (!matchesShortcut(event, shortcut)) {
        return;
      }

      if (shortcut.preventDefault !== false) {
        event.preventDefault();
      }
      shortcut.callback(event);
    });
  }, []);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, handleKeyDown]);
};
