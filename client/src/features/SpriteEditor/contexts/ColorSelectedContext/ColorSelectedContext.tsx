import {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";
import { MakeCodeColor, MakeCodePalette, ArcadePalette } from "@/types/color";

type ColorSelectedType = {
  color: MakeCodeColor;
  setColor: Dispatch<SetStateAction<MakeCodeColor>>;
  palette: MakeCodePalette;
  setPalette: Dispatch<SetStateAction<MakeCodePalette>>;
  alternateColor: MakeCodeColor;
  setAlternateColor: Dispatch<SetStateAction<MakeCodeColor>>;
};

const ColorSelectedContext = createContext<undefined | ColorSelectedType>(
  undefined
);

export const ColorSelectedProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [color, setColor] = useState<MakeCodeColor>(MakeCodeColor.BLACK);
  const [alternateColor, setAlternateColor] = useState<MakeCodeColor>(
    MakeCodeColor.WHITE
  );
  const [palette, setPalette] = useState<MakeCodePalette>(ArcadePalette);

  const contextValue = useMemo(
    () => ({
      color,
      setColor,
      alternateColor,
      setAlternateColor,
      palette,
      setPalette,
    }),
    [color, alternateColor, palette]
  );

  return (
    <ColorSelectedContext.Provider value={contextValue}>
      {children}
    </ColorSelectedContext.Provider>
  );
};

export { ColorSelectedContext };
