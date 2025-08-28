import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
};

const getVariantStyles = (variant: ButtonProps["variant"]) => {
  switch (variant) {
    case "secondary":
      return {
        backgroundColor: "#6b7280",
        boxShadow: "2px 2px 0px #4b5563",
        hoverColor: "#9ca3af",
      };
    case "danger":
      return {
        backgroundColor: "#dc2626",
        boxShadow: "2px 2px 0px #b91c1c",
        hoverColor: "#ef4444",
      };
    case "primary":
    default:
      return {
        backgroundColor: "#058b9b",
        boxShadow: "2px 2px 0px #087984",
        hoverColor: "#0891b2",
      };
  }
};

export const Button = ({
  children,
  className = "",
  variant = "primary",
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) => {
  const variantStyles = getVariantStyles(variant);

  return (
    <button
      className={`
        text-white font-medium rounded shadow 
        transition-all duration-200 
        px-3 py-2 my-2
        flex items-center justify-center
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${
          isLoading || disabled
            ? "opacity-60 cursor-not-allowed"
            : "hover:opacity-90 active:translate-y-0.5 active:shadow-none"
        } 
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
      style={{
        backgroundColor: variantStyles.backgroundColor,
        boxShadow: isLoading || disabled ? "none" : variantStyles.boxShadow,
        border: "none",
        outline: "none",
        appearance: "none",
      }}
      disabled={isLoading || disabled}
      {...props}>
      {isLoading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
      )}
      {children}
    </button>
  );
};

export default Button;
