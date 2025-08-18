import { MakeCodeColor } from "@/types/color";
import { createContext, useRef } from "react";

type SpriteContextType = {
  spriteDataRef: React.RefObject<MakeCodeColor[][]>;
};

const SpriteContext = createContext<undefined | SpriteContextType>(undefined);

export const SpriteProvider = ({ children }: { children: React.ReactNode }) => {
  const spriteDataRef = useRef<MakeCodeColor[][]>([[]]);

  return (
    <SpriteContext.Provider value={{ spriteDataRef }}>
      {children}
    </SpriteContext.Provider>
  );
};

export { SpriteContext };
