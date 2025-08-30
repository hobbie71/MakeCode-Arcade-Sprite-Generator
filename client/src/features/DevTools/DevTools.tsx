import React, { useState } from "react";
import HueWheelDemo from "../../features/DevTools/components/HueWheelTable";
import HueWheelVisualization from "../../features/DevTools/components/HueWheelVisualization";
import { usePaletteSelected } from "../../context/PaletteSelectedContext/usePaletteSelected";
import ImageProcessingPipeline from "./components/ImageProcessingPipeline";

type DevTab = "hue-wheel-table" | "hue-wheel-viz" | "image-processing";

interface DevToolsProps {
  isOpen: boolean;
  onClose: () => void;
}

const DevTools: React.FC<DevToolsProps> = ({ isOpen, onClose }) => {
  const { palette } = usePaletteSelected();
  const [activeTab, setActiveTab] = useState<DevTab>("hue-wheel-table");

  if (!isOpen) return null;

  const renderContent = () => {
    switch (activeTab) {
      case "hue-wheel-table":
        return <HueWheelDemo palette={palette} />;
      case "hue-wheel-viz":
        return <HueWheelVisualization palette={palette} />;
      case "image-processing":
        return <ImageProcessingPipeline />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex backdrop-blur-sm">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">🛠️ Dev Tools</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-700"
              aria-label="Close dev tools">
              <svg
                className="w-5 h-5"
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
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab("hue-wheel-table")}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center space-x-2 ${
                activeTab === "hue-wheel-table"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}>
              <span>🎨</span>
              <span>Hue Wheel Table</span>
            </button>
            <button
              onClick={() => setActiveTab("hue-wheel-viz")}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center space-x-2 ${
                activeTab === "hue-wheel-viz"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}>
              <span>🔍</span>
              <span>Hue Wheel Viz</span>
            </button>
            <button
              onClick={() => setActiveTab("image-processing")}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center space-x-2 ${
                activeTab === "image-processing"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}>
              <span>📸</span>
              <span>Image Processing</span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            Development Tools v1.0
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-gray-950 relative">
        {/* Close overlay when clicking outside sidebar */}
        <div
          className="absolute inset-0 z-0"
          onClick={onClose}
          aria-label="Close dev tools"
        />
        <div className="relative z-10">{renderContent()}</div>
      </div>
    </div>
  );
};

export default DevTools;
