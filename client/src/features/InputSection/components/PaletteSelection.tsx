// Component imports
import DefaultDropDown from "../../../components/DefaultDropDown";

// Context imports
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";
import { useLoading } from "../../../context/LoadingContext/useLoading";

// Type import — palette catalog pre-decorated with swatch previews.
import { PALETTE_OPTIONS } from "../../../types/color";

const PaletteSelection = () => {
  const { palette, setPalette } = usePaletteSelected();
  const { isGenerating } = useLoading();

  const selectedIndex = Math.max(
    0,
    PALETTE_OPTIONS.findIndex((option) => option.palette === palette)
  );

  return (
    <DefaultDropDown
      options={PALETTE_OPTIONS}
      value={selectedIndex}
      onChange={(index) => setPalette(PALETTE_OPTIONS[index].palette)}
      disabled={isGenerating}>
      Palette
    </DefaultDropDown>
    /* TODO: Create Custom Palette Button */
  );
};

export default PaletteSelection;
