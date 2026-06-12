import { useContext } from "react";
import { SpriteContext } from "./SpriteContext";

export const useSprite = () => {
  const context = useContext(SpriteContext);
  if (!context) throw new Error("useSprite must be inside <SpriteProvider>");
  const { value: spriteData, setValue: setSpriteData } = context;
  return { spriteData, setSpriteData };
};
