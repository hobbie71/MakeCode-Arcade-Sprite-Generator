import { useCallback, useRef } from "react";

// Context imports
import { useSprite } from "../../../context/SpriteContext/useSprite";
import { useCanvasSize } from "@/context/CanvasSizeContext/useCanvasSize";

// Type imports
import { MakeCodeColor } from "@/types/color";
import { Coordinates } from "@/types/pixel";
import { ImageExportFormats } from "@/types/export";

// Lib imports
import { drawPixelOnCanvasTransparent } from "../libs/drawPixelOnCanvas";
import { getResizedSpriteData } from "@/libs/getResizedSpriteData";

// Const imports
import { PIXEL_SIZE } from "../constants/pixelSize";

export const useSpriteData = () => {
  const { setSpriteData, spriteData } = useSprite();
  const { width, height } = useCanvasSize();

  // Ref to store sprite data during drawing (doesn't trigger rerenders)
  const spriteDataRef = useRef<MakeCodeColor[][]>([[]]);

  // Initialize ref with proper data when spriteData changes
  if (spriteData.length > 0 && spriteData[0].length > 0) {
    spriteDataRef.current = spriteData;
  }

  const setSpriteDataCoordinates = useCallback(
    (coordinates: Coordinates, color: MakeCodeColor) => {
      if (coordinates.x >= width || coordinates.y >= height) return;

      if (!spriteDataRef.current[coordinates.y]) return;
      spriteDataRef.current[coordinates.y][coordinates.x] = color;
    },
    [height, width]
  );

  const commitSpriteData = useCallback(() => {
    const newSpriteData = spriteDataRef.current.map((row) => [...row]);
    setSpriteData(newSpriteData);
  }, [setSpriteData]);

  const getCurrentSpriteData = useCallback(() => {
    return spriteDataRef.current;
  }, []);

  const resizeSpriteData = useCallback(
    (newData: MakeCodeColor[][]) => {
      // Update both ref and state with the new resized data
      spriteDataRef.current = newData;
      setSpriteData(newData);
    },
    [setSpriteData]
  );

  const initSpriteData = useCallback(() => {
    const data = Array.from({ length: height }, () =>
      Array(width).fill(MakeCodeColor.TRANSPARENT)
    );

    spriteDataRef.current = data;
    setSpriteData(data);
    return data;
  }, [height, width, setSpriteData]);

  const initCanvasOnly = useCallback(() => {
    // Only initialize sprite data if it's completely empty
    if (!spriteDataRef.current || spriteDataRef.current.length === 0) {
      const data = Array.from({ length: height }, () =>
        Array(width).fill(MakeCodeColor.TRANSPARENT)
      );
      spriteDataRef.current = data;
      setSpriteData(data);
    } else if (
      spriteDataRef.current.length !== height ||
      (spriteDataRef.current[0] && spriteDataRef.current[0].length !== width)
    ) {
      // If size is wrong, resize the existing data to preserve artwork
      const resizedData = getResizedSpriteData(
        spriteDataRef.current,
        width,
        height
      );
      spriteDataRef.current = resizedData;
      setSpriteData(resizedData);
    }
    return spriteDataRef.current;
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
    spriteData,
    initSpriteData,
    initCanvasOnly,
    setSpriteDataCoordinates,
    commitSpriteData,
    getCurrentSpriteData,
    resizeSpriteData,
    getImgCode,
    exportSpriteToImage,
  };
};
