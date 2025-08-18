// Style import
import "./ColorIcon.scss";
import { memo } from "react";

// Context imports
import { useColorSelected } from "../../../contexts/ColorSelectedContext/useColorSelected";

// Type imports
import { MakeCodeColor } from "@/types/color";

// Util imports
import { getHexFromColor } from "@/utils/getHexFromColor";

interface Props {
  color: MakeCodeColor;
}

const ColorIcon = memo(({ color }: Props) => {
  const { setColor } = useColorSelected();

  return (
    <div
      className={`
        min-w-7 min-h-7 m-0.5 rounded hover:opacity-60 transition-opacity
        ${color === MakeCodeColor.TRANSPARENT ? "transparent" : ""}
        `}
      onClick={() => setColor(color)}
      style={{
        backgroundColor: getHexFromColor(color),
      }}
    />
  );
});

ColorIcon.displayName = "ColorIcon";

export default ColorIcon;
