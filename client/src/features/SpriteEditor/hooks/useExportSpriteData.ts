import { useCallback } from "react";

// Context imports
import { useSprite } from "@/context/SpriteContext/useSprite";
import { useCanvasSize } from "@/context/CanvasSizeContext/useCanvasSize";

// Lib imports
import { drawPixelOnCanvasTransparent } from "../libs/drawPixelOnCanvas";

// Type imports
import { ImageExportFormats } from "@/types/export";
import { PIXEL_SIZE } from "../constants/pixelSize";

export const useExportSpriteData = () => {
  const { spriteData } = useSprite();
  const { height, width } = useCanvasSize();

  const exportSpriteToImage = useCallback(
    (format: ImageExportFormats) => {
      const exportCanvas = document.createElement("canvas");
      const ctx = exportCanvas.getContext("2d");
      if (!ctx) return;

      exportCanvas.width = width * PIXEL_SIZE;
      exportCanvas.height = height * PIXEL_SIZE;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const color = spriteData[y][x];
          drawPixelOnCanvasTransparent(exportCanvas, { x, y }, color);
        }
      }

      // Export in desired format
      const url = exportCanvas.toDataURL(`image/${format}`);
      const link = document.createElement("a");
      link.href = url;
      link.download = "my-sprite"; // file name
      link.click();
      link.remove();
    },
    [height, width, spriteData]
  );

  const getImgCode = useCallback((): string => {
    const imgCode = "img";

    const rows = spriteData.map((row) =>
      row.map((color) => color.toString()).join(" ")
    );
    const body = rows.join("\n");
    const result = `${imgCode}\`\n${body}\n\``;
    return result;
  }, [spriteData]);

  const getJavaScriptCode = useCallback((): string => {
    return `const mySprite = sprites.create(${getImgCode()}, SpriteKind.Player)`;
  }, [getImgCode]);

  const getPythonCode = useCallback((): string => {
    return `my_sprite = arcade_sprites.create_sprite(${getImgCode().replace("img", "").replace("`", '"""').replace("`", '"""')}, sprite_kind="Player")`;
  }, [getImgCode]);

  return { getImgCode, exportSpriteToImage, getJavaScriptCode, getPythonCode };
};
