import { useCallback } from "react";

// Context imports
import { useSprite } from "../../../context/SpriteContext/useSprite";
import { useCanvasSize } from "@/context/CanvasSizeContext/useCanvasSize";

// Type imports
import { MakeCodeColor } from "@/types/color";
import { Coordinates } from "@/types/pixel";
import { ImageExportFormats } from "@/types/export";

// Lib imports
import { drawPixelOnCanvasTransparent } from "../libs/drawPixelOnCanvas";

// Const imports
import { PIXEL_SIZE } from "../constants/pixelSize";

export const useSpriteData = () => {
  const { setSpriteData, spriteData } = useSprite();
  const { width, height } = useCanvasSize();

  const updateSpriteData = useCallback(
    (coordinates: Coordinates, color: MakeCodeColor) => {
      if (coordinates.x >= width || coordinates.y >= height) return;

      setSpriteData((prevData) => {
        const newData = prevData.map((row) => [...row]);
        newData[coordinates.y][coordinates.x] = color;
        return newData;
      });
    },
    [height, width, setSpriteData]
  );

  const initSpriteData = useCallback(() => {
    const data = Array.from({ length: height }, () =>
      Array(width).fill(MakeCodeColor.TRANSPARENT)
    );
    setSpriteData(data);
  }, [height, width, setSpriteData]);

  const getImgCode = useCallback((): string => {
    const imgCode = "img";

    const rows = spriteData.map((row) =>
      row.map((color) => color.toString()).join(" ")
    );
    const body = rows.join("\n");
    const result = `${imgCode}\`\n${body}\n\``;
    return result;
  }, [spriteData]);

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

  return {
    initSpriteData,
    updateSpriteData,
    getImgCode,
    exportSpriteToImage,
  };
};
