import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: "primary" | "danger" | "success" | "outline" | "chip";
  size?: "sm" | "md" | "lg";
  /** Toggle state for chip-style buttons. When provided (even false), renders
      aria-pressed and the `.active` treatment while true. */
  pressed?: boolean;
  isLoading?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
};

const VARIANT_CLASS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "btn-primary",
  danger: "btn-danger",
  success: "btn-success",
  outline: "btn-outline",
  chip: "btn-chip",
};

const SIZE_CLASS: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
};

const Button = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  pressed,
  isLoading = false,
  disabled,
  ref,
  ...props
}: ButtonProps) => {
  const classes = [
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    pressed ? "active" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      ref={ref}
      type="button"
      className={classes}
      aria-pressed={pressed}
      disabled={isLoading || disabled}
      {...props}>
      {children}
    </button>
  );
};

export default Button;
