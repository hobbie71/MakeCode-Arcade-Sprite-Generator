import { MakeCodeColor } from "@/types/color";
import { createContext, useState, useMemo } from "react";

type SpriteContextType = {
  spriteData: MakeCodeColor[][];
  setSpriteData: React.Dispatch<React.SetStateAction<MakeCodeColor[][]>>;
};

const SpriteContext = createContext<undefined | SpriteContextType>(undefined);

export const SpriteProvider = ({ children }: { children: React.ReactNode }) => {
  const [spriteData, setSpriteData] = useState<MakeCodeColor[][]>([[]]);

  const contextValue = useMemo(
    () => ({
      spriteData,
      setSpriteData,
    }),
    [spriteData]
  );

  return (
    <SpriteContext.Provider value={contextValue}>
      {children}
    </SpriteContext.Provider>
  );
};

export { SpriteContext };
