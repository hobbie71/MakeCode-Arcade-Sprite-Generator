import { ALL_PALETTES } from "@/types/color";
import { usePaletteSelected } from "@/context/PaletteSelectedContext/usePaletteSelected";

const PaletteSelector = () => {
  const { palette, setPalette } = usePaletteSelected();

  return (
    <div className="mb-8 flex space-x-4 max-w-full overflow-auto">
      {ALL_PALETTES.map((currentPalette, i) => (
        <button
          key={i}
          onClick={() => setPalette(currentPalette.palette)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentPalette.palette === palette
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}>
          {currentPalette.name}
        </button>
      ))}
    </div>
  );
};

export default PaletteSelector;
