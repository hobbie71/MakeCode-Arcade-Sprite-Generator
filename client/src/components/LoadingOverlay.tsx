import React from "react";
import { useLoading } from "../context/LoadingContext/useLoading";
import SquareResponiveAd from "./AdComponents/SquareResponiveAd";
import ErrorSymbol from "./ErrorSymbol";

const LoadingOverlay: React.FC = () => {
  const { isGenerating, generationMessage } = useLoading();

  if (!isGenerating) return null;

  return (
    <div className="popup">
      <div className="popup-content text-center max-w-md mx-auto">
        {/* Loading Spinner */}
        <div className="mb-4">
          <div className="animate-spin rounded-[50%] h-16 w-16 border-4 border-info-500 border-t-transparent mx-auto"></div>
        </div>

        {/* Loading Message */}
        <h4 className="heading-4 mb-4 text-text-default-300">
          {generationMessage || "Generating Sprite..."}
        </h4>

        {/* Warning Message */}
        <div className="bg-warning-500 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <ErrorSymbol />
            <div className="text-center">
              <p className="paragraph text-text-default-300 mb-1">
                Please wait. This can take 1 - 2 minutes
              </p>
              <p className="paragraph-sm text-text-default-300 mb-1">
                Do not close this window or navigate away
              </p>
            </div>
            <ErrorSymbol />
          </div>
        </div>

        {/* Ad Container - flexible sizing */}
        <div className="mb-4 min-h-[200px] flex items-center justify-center">
          <SquareResponiveAd />
        </div>

        {/* Additional Info */}
        <p className="text-text-default-100 text-sm">
          AI image generation is processing your request...
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
