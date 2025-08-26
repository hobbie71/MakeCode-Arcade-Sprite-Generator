import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
};

export const Button = ({ children, className = "", ...props }: ButtonProps) => (
  <button
    className={`text-white px-4 py-2 rounded mr-4 shadow hover:opacity-80 transition-opacity ${className}`}
    style={{
      backgroundColor: "#058b9b",
      boxShadow: "2px 2px 0px #087984",
      border: "none",
      outline: "none",
      appearance: "none",
    }}
    {...props}>
    {children}
  </button>
);

export default Button;
