import React from "react";
import HueWheelVisualization from "@/components/HueWheelVisualization";
import { ArcadePalette, MattePalette, PastelPalette } from "@/types/color";

const HueWheelDemo: React.FC = () => {
  const [selectedPalette, setSelectedPalette] = React.useState("arcade");

  const palettes = {
    arcade: ArcadePalette,
    matte: MattePalette,
    pastel: PastelPalette,
  };

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Hue Wheel Visualization Demo
        </h1>

        {/* Palette Selector */}
        <div className="mb-8 flex justify-center space-x-4">
          {Object.keys(palettes).map((paletteKey) => (
            <button
              key={paletteKey}
              onClick={() => setSelectedPalette(paletteKey)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedPalette === paletteKey
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}>
              {paletteKey.charAt(0).toUpperCase() + paletteKey.slice(1)} Palette
            </button>
          ))}
        </div>

        {/* Visualization */}
        <HueWheelVisualization
          palette={palettes[selectedPalette as keyof typeof palettes]}
        />
      </div>
    </div>
  );
};

export default HueWheelDemo;
