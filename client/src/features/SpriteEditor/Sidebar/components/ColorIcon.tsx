import { memo } from "react";

// Context imports
import { useColorSelected } from "../../contexts/ColorSelectedContext/useColorSelected";

// Type imports
import { MakeCodeColor, MakeCodePalette } from "@/types/color";

// Util imports
import { getHexFromMakeCodeColor } from "@/utils/colorUtils";

interface Props {
  color: MakeCodeColor;
  palette: MakeCodePalette;
}

const ColorIcon = memo(({ color, palette }: Props) => {
  const { setColor } = useColorSelected();

  return (
    <div
      className={`color-swatch ${color === MakeCodeColor.TRANSPARENT ? "transparent" : ""}`}
      onClick={() => setColor(color)}
      style={{
        backgroundColor: getHexFromMakeCodeColor(color, palette),
      }}
    />
  );
});

ColorIcon.displayName = "ColorIcon";

export default ColorIcon;
