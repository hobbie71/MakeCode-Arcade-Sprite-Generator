// Context imports
import { usePaletteSelected } from "@/context/PaletteSelectedContext/usePaletteSelected";

// Component imports
import ColorIcon from "./ColorIcon";

// Type imports
import { ColorOrder } from "@/types/color";

const ColorIcons = () => {
  const { palette } = usePaletteSelected();

  return (
    <div className="color-palette my-2">
      {ColorOrder.map((color, i) => (
        <ColorIcon key={i} color={color} palette={palette} />
      ))}
    </div>
  );
};

export default ColorIcons;
