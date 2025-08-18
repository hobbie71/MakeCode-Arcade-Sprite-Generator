import { useCallback } from "react";

// Context imports
import { useSprite } from "../contexts/SpriteContext/useSprite";
import { useCanvasSize } from "@/context/CanvasSizeContext/useCanvasSize";

// Type imports
import { MakeCodeColor } from "@/types/color";
import { Coordinates } from "@/types/pixel";

export const useSpriteData = () => {
  const { spriteDataRef } = useSprite();
  const { width, height } = useCanvasSize();

  const updateSpriteData = useCallback(
    (coordinates: Coordinates, color: MakeCodeColor) => {
      const data = spriteDataRef.current;
      data[coordinates.y][coordinates.x] = color;
    },
    [spriteDataRef]
  );

  const initSpriteData = useCallback(() => {
    const data = Array.from({ length: height }, () =>
      Array(width).fill(MakeCodeColor.TRANSPARENT)
    );
    spriteDataRef.current = data;
  }, [height, spriteDataRef, width]);

  const getImgCode = useCallback((): string => {
    const data = spriteDataRef.current;
    const imgCode = "img";

    const rows = data.map((row) =>
      row.map((color) => color.toString()).join(" ")
    );
    const body = rows.join("\n");
    return `${imgCode}\`\n${body}\n\``;
  }, [spriteDataRef]);

  return { initSpriteData, updateSpriteData, getImgCode };
};
