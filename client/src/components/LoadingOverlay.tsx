import React from "react";
import { useLoading } from "@/context/LoadingContext/useLoading";

const LoadingOverlay: React.FC = () => {
  const { isGenerating, generationMessage } = useLoading();

  if (!isGenerating) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl">
        {/* Loading Spinner */}
        <div className="mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
        </div>

        {/* Loading Message */}
        <h3 className="text-xl font-semibold text-white mb-4">
          {generationMessage || "Generating sprite..."}
        </h3>

        {/* Warning Message */}
        <div className="bg-yellow-900 border border-yellow-600 rounded-md p-4 mb-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-yellow-200 text-sm font-medium">
                Please wait - this may take a few minutes
              </p>
              <p className="text-yellow-300 text-xs mt-1">
                Do not close this window or navigate away
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <p className="text-gray-400 text-sm">
          AI image generation is processing your request...
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
