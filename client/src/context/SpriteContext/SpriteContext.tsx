import { MakeCodeColor } from "@/types/color";
import { createContext, useState } from "react";

type SpriteContextType = {
  spriteData: MakeCodeColor[][];
  setSpriteData: React.Dispatch<React.SetStateAction<MakeCodeColor[][]>>;
};

const SpriteContext = createContext<undefined | SpriteContextType>(undefined);

export const SpriteProvider = ({ children }: { children: React.ReactNode }) => {
  const [spriteData, setSpriteData] = useState<MakeCodeColor[][]>([[]]);

  return (
    <SpriteContext.Provider value={{ spriteData, setSpriteData }}>
      {children}
    </SpriteContext.Provider>
  );
};

export { SpriteContext };
