interface BackdropProps {
  onDismiss: () => void;
  "aria-label"?: string;
}

/** Invisible dismiss scrim behind sheets/popovers. A real <button> so the
    backdrop stays keyboard-focusable and screen-reader dismissable. */
export const Backdrop = ({
  onDismiss,
  "aria-label": ariaLabel = "Close",
}: BackdropProps) => (
  <button
    type="button"
    aria-label={ariaLabel}
    onClick={onDismiss}
    className="absolute inset-0 bg-ink/30"
  />
);

export default Backdrop;
