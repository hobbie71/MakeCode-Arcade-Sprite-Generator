import { createContext, useState, useMemo } from "react";

import type { Dispatch, SetStateAction } from "react";
import { MakeCodeColor } from "../../../../types/color";

type ColorSelectedType = {
  color: MakeCodeColor;
  setColor: Dispatch<SetStateAction<MakeCodeColor>>;
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

  const contextValue = useMemo(
    () => ({
      color,
      setColor,
      alternateColor,
      setAlternateColor,
    }),
    [color, alternateColor]
  );

  return (
    <ColorSelectedContext.Provider value={contextValue}>
      {children}
    </ColorSelectedContext.Provider>
  );
};

export { ColorSelectedContext };
