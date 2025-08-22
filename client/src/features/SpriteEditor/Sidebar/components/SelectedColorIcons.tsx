import { useColorSelected } from "@/features/SpriteEditor/contexts/ColorSelectedContext/useColorSelected";
import { MakeCodeColor } from "@/types";
import { getHexFromColor } from "@/utils/getHexFromColor";

const ICON_SIZE = 32; // px

const SelectedColorIcons = () => {
  const { color, setColor, alternateColor, setAlternateColor } =
    useColorSelected();

  function swapColors() {
    const tempColor = color;
    setColor(alternateColor);
    setAlternateColor(tempColor);
  }

  return (
    <div
      className="relative"
      style={{ width: "100%", height: ICON_SIZE + 8 }} // +8 for overlap
      onClick={() => swapColors()}>
      <div
        className={`absolute border border-black rounded ${color === MakeCodeColor.TRANSPARENT ? "transparent" : ""}`}
        style={{
          width: "80%",
          height: ICON_SIZE,
          top: 0,
          left: 0,
          backgroundColor: getHexFromColor(color),
          zIndex: 2,
        }}
      />
      <div
        className={`absolute border border-black rounded ${alternateColor === MakeCodeColor.TRANSPARENT ? "transparent" : ""}`}
        style={{
          width: "80%",
          height: ICON_SIZE,
          bottom: 0,
          right: 0,
          backgroundColor: getHexFromColor(alternateColor),
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default SelectedColorIcons;
