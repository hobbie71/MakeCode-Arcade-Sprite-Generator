import React from "react";
import { useLoading } from "../context/LoadingContext/useLoading";
import SquareResponiveAd from "./AdComponents/SquareResponiveAd";

const LoadingOverlay: React.FC = () => {
  const { isGenerating, generationMessage } = useLoading();

  if (!isGenerating) return null;

  return (
    <div className="popup">
      <div className="popup-content text-center max-w-md mx-auto">
        {/* Loading Spinner */}
        <div className="mb-4">
          <div className="animate-spin rounded-lg h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
        </div>

        {/* Loading Message */}
        <h4 className="heading-4 mb-4">
          {generationMessage || "Generating Sprite..."}
        </h4>

        {/* Warning Message */}
        <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-yellow-300 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-center">
              <p className="text-yellow-200">
                Please wait. This usually takes 1 - 2 minutes
              </p>
              <p className="text-neutral-200 text-sm mt-1">
                Do not close this window or navigate away
              </p>
            </div>
          </div>
        </div>

        {/* Ad Container - flexible sizing */}
        <div className="mb-4 min-h-[200px] flex items-center justify-center">
          <SquareResponiveAd />
        </div>

        {/* Additional Info */}
        <p className="text-neutral-200 text-sm">
          AI image generation is processing your request...
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
