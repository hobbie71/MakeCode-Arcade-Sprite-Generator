import { cloneElement, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

type TooltipPlacement = "right" | "left" | "top" | "bottom";

interface TooltipProps {
  text: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  delay?: number;
  hotkey?: string;
  /** Which side of the trigger the bubble sits on. Defaults to the right — the
   *  left-rail pattern from the mockup. Use "left"/"bottom" for triggers near the
   *  right/top screen edges so the bubble opens toward open space. */
  placement?: TooltipPlacement;
  /** Sizing classes for the wrapper. Defaults to the 32px tool-button cap. */
  className?: string;
  /** When true, the bubble never shows (hover is inert). Lets callers keep the
      wrapper mounted — so a child can animate between states without remounting —
      while suppressing a redundant tooltip (e.g. on an already-labelled tab). */
  disabled?: boolean;
}

// Gap (px) between the trigger and the bubble.
const GAP = 8;

// Hover-intent delay (ms). 200ms reads as instant once you've settled on a
// target but stays quiet while the cursor is just passing over the rail.
const DEFAULT_DELAY = 200;

type Coords = { top: number; left: number; transform: string };

// Fixed-viewport coords plus a centering transform per side. The transform
// keeps the bubble centered on the trigger without having to measure the
// bubble itself, so a single trigger rect is enough to position it.
function computeCoords(r: DOMRect, placement: TooltipPlacement): Coords {
  switch (placement) {
    case "left":
      return {
        top: r.top + r.height / 2,
        left: r.left - GAP,
        transform: "translate(-100%, -50%)",
      };
    case "top":
      return {
        top: r.top - GAP,
        left: r.left + r.width / 2,
        transform: "translate(-50%, -100%)",
      };
    case "bottom":
      return {
        top: r.bottom + GAP,
        left: r.left + r.width / 2,
        transform: "translate(-50%, 0)",
      };
    case "right":
    default:
      return {
        top: r.top + r.height / 2,
        left: r.right + GAP,
        transform: "translateY(-50%)",
      };
  }
}

const Tooltip = ({
  text,
  children,
  delay = DEFAULT_DELAY,
  hotkey,
  placement = "right",
  className = "max-w-[32px] max-h-[32px]",
  disabled = false,
}: TooltipProps) => {
  // Non-null coords double as the "is showing" flag.
  const [coords, setCoords] = useState<Coords | null>(null);
  const tooltipId = useId();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);

  const showTooltip = coords !== null;

  const handleMouseEnter = () => {
    if (disabled) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      const el = wrapperRef.current;
      if (el) {
        setCoords(computeCoords(el.getBoundingClientRect(), placement));
      }
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setCoords(null);
  };

  // Clear any pending timer if the trigger unmounts mid-hover.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Clone the child element and add hover handlers and aria-describedby
  const childWithProps = cloneElement(children, {
    onMouseEnter: (e: React.MouseEvent) => {
      handleMouseEnter();
      if (children.props.onMouseEnter) {
        children.props.onMouseEnter(e);
      }
    },
    onMouseLeave: (e: React.MouseEvent) => {
      handleMouseLeave();
      if (children.props.onMouseLeave) {
        children.props.onMouseLeave(e);
      }
    },
    "aria-describedby": showTooltip
      ? tooltipId
      : children.props["aria-describedby"],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  return (
    <span ref={wrapperRef} className={`relative inline-flex ${className}`}>
      {childWithProps}

      {/* Portaled to <body> so the bubble escapes the overflow/stacking context
          of scrollable panels (e.g. the palette dock) and never clips. */}
      {showTooltip &&
        createPortal(
          <div
            id={tooltipId}
            role="tooltip"
            aria-hidden="false"
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              transform: coords.transform,
            }}
            className="pointer-events-none z-50">
            {/* Inner element owns the pop animation so it never fights the
                positioning transform on the anchor above. */}
            <div
              className="tooltip-pop flex items-center whitespace-nowrap rounded-lg
                         bg-ink px-2.5 py-1.5 text-sm font-medium leading-none
                         text-surface-raised shadow-lg">
              <span>{text}</span>
              {hotkey && <span className="ml-2 opacity-60">{hotkey}</span>}
            </div>
          </div>,
          document.body
        )}
    </span>
  );
};

export default Tooltip;
