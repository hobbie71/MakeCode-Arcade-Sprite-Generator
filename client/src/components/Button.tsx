import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
};

export const Button = ({
  children,
  className = "",
  variant = "primary",
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) => {
  const getButtonClass = () => {
    switch (variant) {
      case "secondary":
        return "btn-secondary";
      case "danger":
        return "btn-danger";
      case "primary":
      default:
        return "btn-primary";
    }
  };

  return (
    <button
      className={`${getButtonClass()} ${className}`}
      disabled={isLoading || disabled}
      {...props}>
      {isLoading && <div className="loading-spinner mr-2" />}
      {children}
    </button>
  );
};

export default Button;
