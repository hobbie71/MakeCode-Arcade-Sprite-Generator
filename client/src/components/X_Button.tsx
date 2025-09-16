import React from "react";

interface X_ButtonProps {
  onClick: () => void;
}

const X_Button: React.FC<X_ButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="text-white hover:text-gray-300 transition-colors sm:hidden"
      aria-label="Close sidebar">
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};

export default X_Button;
