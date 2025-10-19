// Context imports
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";

// Type import
import { ALL_PALETTES } from "../../../types/color";
import type { MakeCodePalette } from "../../../types/color";

const PaletteSelection = () => {
  const { palette, setPalette } = usePaletteSelected();

  const getPaletteFromIndex = (index: number): MakeCodePalette => {
    return ALL_PALETTES[index].palette;
  };

  return (
    <div className="form-group flex flex-row justify-between">
      <p className="form-label" id="palette-selection-label">
        Palette:
      </p>
      <div>
        <select
          className="form-select"
          value={ALL_PALETTES.findIndex((pal) => pal.palette === palette)}
          onChange={(e) =>
            setPalette(getPaletteFromIndex(parseInt(e.target.value)))
          }
          aria-labelledby="palette-selection-label"
          aria-describedby="palette-selection-description">
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
