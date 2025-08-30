import { createContext, useState, useMemo } from "react";
import type { SetStateAction, Dispatch } from "react";

import { ArcadePalette } from "../../types/color";
import type { MakeCodePalette } from "../../types/color";

type paletteSelectedType = {
  palette: MakeCodePalette;
  setPalette: Dispatch<SetStateAction<MakeCodePalette>>;
};

const PaletteSelectedContext = createContext<undefined | paletteSelectedType>(
  undefined
);

export const PaletteSelectedProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [palette, setPalette] = useState<MakeCodePalette>(ArcadePalette);

  const contextValue = useMemo(
    () => ({
      palette,
      setPalette,
    }),
    [palette]
  );

  return (
    <PaletteSelectedContext.Provider value={contextValue}>
      {children}
    </PaletteSelectedContext.Provider>
  );
};

export { PaletteSelectedContext };
