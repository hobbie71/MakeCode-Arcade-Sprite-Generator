import { useColorSelected } from "../../../../features/SpriteEditor/contexts/ColorSelectedContext/useColorSelected";
import { MakeCodeColor } from "../../../../types/color";
import { getHexFromMakeCodeColor } from "../../../../utils/colors/getColorFromMakeCodeColor";

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
      className="relative w-full my-2"
      style={{ height: ICON_SIZE + 8 }} // +8 for overlap
      onClick={() => swapColors()}>
      <div
        className={`absolute border border-black rounded w-4/5 top-0 left-0 z-10 ${color === MakeCodeColor.TRANSPARENT ? "transparent" : ""}`}
        style={{
          height: ICON_SIZE,
          backgroundColor: getHexFromMakeCodeColor(color),
        }}
      />
      <div
        className={`absolute border border-black rounded w-4/5 bottom-0 right-0 z-0 ${alternateColor === MakeCodeColor.TRANSPARENT ? "transparent" : ""}`}
        style={{
          height: ICON_SIZE,
          backgroundColor: getHexFromMakeCodeColor(alternateColor),
        }}
      />
    </div>
  );
};

export default SelectedColorIcons;
