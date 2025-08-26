// Context imports
import { usePaletteSelected } from "@/context/PaletteSelectedContext/usePaletteSelected";

// Type import
import { ALL_PALETTES, MakeCodePalette } from "@/types/color";

const PaletteSelection = () => {
  const { palette, setPalette } = usePaletteSelected();

  const getPaletteFromIndex = (index: number): MakeCodePalette => {
    return ALL_PALETTES[index].palette;
  };

  return (
    <div className="">
      <h3 className="heading-3">Palette Selection</h3>
      <div className="flex flex-col justify-around">
        <select
          className="border rounded px-2 py-1 mb-4 text-black text-center"
          value={ALL_PALETTES.findIndex((pal) => pal.palette === palette)}
          onChange={(e) =>
            setPalette(getPaletteFromIndex(parseInt(e.target.value)))
          }>
          {ALL_PALETTES.map((pal, index) => (
            <option key={pal.name} value={index}>
              {pal.name}
            </option>
          ))}
        </select>
        {/* TODO: Create Custom Palette Button */}
      </div>
    </div>
  );
};

export default PaletteSelection;
