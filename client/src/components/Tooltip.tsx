import { cloneElement, useId, useRef, useState } from "react";

interface TooltipProps {
  text: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  delay?: number;
  hotkey?: string;
}

const Tooltip = ({ text, children, delay = 500, hotkey }: TooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipId = useId();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowTooltip(false);
  };

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
    <span className="relative max-w-[32px] max-h-[32px]">
      {childWithProps}

      {showTooltip && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute top-full left-full mt-1 z-50
                     px-1.5 py-0.5 text-[10px] font-normal text-text-default-300 bg-default-200 
                     shadow-default-lg rounded pointer-events-none whitespace-nowrap"
          aria-hidden="false">
          <span>{text}</span>
          {hotkey && <span className="ml-1 opacity-75">({hotkey})</span>}
        </div>
      )}
    </span>
  );
};

export default Tooltip;
