import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import IconButton from "../IconButton";

type ModalSize = "sm" | "md" | "lg" | "xl";

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  size?: ModalSize;
  /** Pinned footer (e.g. Cancel / primary action). */
  footer?: React.ReactNode;
  /** Disable Escape + backdrop-click close (default: closable). */
  dismissable?: boolean;
  children: React.ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal primitive: portals to <body>, dims + (optionally) closes on
 * backdrop click / Escape, traps Tab focus, restores focus on close, and locks
 * body scroll while open. The three feature modals (Generate / Resize / Export)
 * compose this.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  size = "md",
  footer,
  dismissable = true,
  children,
}: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const getFocusable = useCallback(
    () =>
      Array.from(
        contentRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []
      ).filter((el) => el.offsetParent !== null),
    []
  );

  // Escape-to-close + Tab focus trap.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissable) {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const focusable = getFocusable();
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [isOpen, dismissable, onClose, getFocusable]);

  // Body scroll lock + focus management.
  useEffect(() => {
    if (!isOpen) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = window.setTimeout(() => {
      const focusable = getFocusable();
      (focusable[0] ?? contentRef.current)?.focus();
    }, 0);
    return () => {
      window.clearTimeout(id);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen, getFocusable]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && dismissable) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}>
      <div
        ref={contentRef}
        tabIndex={-1}
        className={`relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-modal border border-line bg-surface-raised shadow-lg outline-none ${SIZE_CLASSES[size]}`}>
        <IconButton
          size="sm"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-ink-subtle hover:text-ink">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </IconButton>

        {(title || subtitle) && (
          <div className="px-5 pr-12 pt-5 sm:px-6 sm:pr-14 sm:pt-6">
            {title && (
              <h2 className="text-h3 font-bold leading-tight text-ink">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {children}
        </div>

        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-line bg-surface px-5 py-4 sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
