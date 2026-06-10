import React from "react";

type IconButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label"
> & {
  /** Required: icon-only controls must describe themselves. */
  "aria-label": string;
  children: React.ReactNode;
  /** md = fixed 32px square (tool rail, undo/redo); sm = content-sized p-1
      (modal close, dock chevrons, dismiss icons). */
  size?: "md" | "sm";
  /** Toggle state (tool selection, grid toggle). When provided (even false),
      renders aria-pressed and the accent `.active` fill while true. */
  pressed?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
};

export const IconButton = ({
  children,
  className = "",
  size = "md",
  pressed,
  ref,
  ...props
}: IconButtonProps) => {
  const classes = [
    "icon-btn",
    size === "sm" ? "icon-btn-sm" : "icon-btn-md",
    pressed ? "active" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Spreading props onto the real <button> is load-bearing: Tooltip injects
  // hover handlers and aria-describedby via cloneElement.
  return (
    <button
      ref={ref}
      type="button"
      className={classes}
      aria-pressed={pressed}
      {...props}>
      {children}
    </button>
  );
};

export default IconButton;
