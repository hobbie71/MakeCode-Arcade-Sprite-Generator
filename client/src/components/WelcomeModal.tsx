import React from "react";

interface WelcomeModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-300">
        {/* Warning Icon */}
        <div className="flex items-center justify-center mb-4">
          <div className="bg-yellow-100 rounded-full p-3 shadow-md">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Welcome to MakeCode Arcade Sprite Generator
        </h2>

        {/* Warning Text */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-center mb-2">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-gray-700 text-center leading-relaxed font-medium">
            <strong>This project is under development.</strong>
          </p>
          <p className="text-gray-600 text-center text-sm mt-1">
            Some features are not completed and the app might be buggy.
          </p>
        </div>

        {/* Issue Report Information */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6 shadow-sm">
          <p className="text-gray-700 text-center leading-relaxed">
            If you encounter any issues, please report them using the{" "}
            <span className="font-semibold text-red-600 bg-red-100 px-2 py-1 rounded animate-pulse shadow-sm">
              "Report an Issue Here!"
            </span>{" "}
            button located in the{" "}
            <span className="font-semibold text-blue-600">
              bottom-right corner
            </span>{" "}
            of the screen.
          </p>
          <div className="mt-3 text-center">
            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
              👆 Look for the red button after closing this modal
            </span>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300">
          Continue to App →
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;
