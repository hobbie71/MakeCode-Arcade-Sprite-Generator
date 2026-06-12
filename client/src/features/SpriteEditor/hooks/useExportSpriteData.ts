import { useCallback } from "react";

// Context imports
import { useSprite } from "../../../context/SpriteContext/useSprite";
import { useCanvasSize } from "../../../context/CanvasSizeContext/useCanvasSize";
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";
import { useStrokeSize } from "../contexts/StrokeSizeContext/useStrokeSize";

// Lib imports
import { drawPixelOnCanvasTransparent } from "../libs/drawPixelOnCanvas";

// Type imports
import { ImageExportFormats } from "../../../types/export";
import { MakeCodeColor } from "../../../types/color";
import { PIXEL_SIZE } from "../constants/canvas";

export const useExportSpriteData = () => {
  const { spriteData } = useSprite();
  const { height, width } = useCanvasSize();
  const { palette } = usePaletteSelected();
  const { strokeSize } = useStrokeSize();

  /**
   * Render sprite data to a data URL (used for previews + downloads). Defaults to
   * the live editor sprite, but callers can pass explicit data + dimensions to
   * render an arbitrary matrix — e.g. the Resize & Process modal previewing a
   * *pending* resize of a hand-drawn sprite without touching the editor.
   */
  const getSpriteDataUrl = useCallback(
    (
      format: ImageExportFormats = ImageExportFormats.PNG,
      data: MakeCodeColor[][] = spriteData,
      cols: number = width,
      rows: number = height
    ): string => {
      const exportCanvas = document.createElement("canvas");
      const ctx = exportCanvas.getContext("2d");
      if (!ctx) return "";

      exportCanvas.width = cols * PIXEL_SIZE;
      exportCanvas.height = rows * PIXEL_SIZE;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const color = data[y]?.[x] ?? MakeCodeColor.TRANSPARENT;
          drawPixelOnCanvasTransparent(
            exportCanvas,
            { x, y },
            color,
            palette,
            PIXEL_SIZE,
            strokeSize
          );
        }
      }

      return exportCanvas.toDataURL(`image/${format}`);
    },
    [height, width, spriteData, palette, strokeSize]
  );

  const exportSpriteToImage = useCallback(
    (format: ImageExportFormats) => {
      const url = getSpriteDataUrl(format);
      if (!url) return;
      const link = document.createElement("a");
      link.href = url;
      link.download = "my-sprite"; // file name
      link.click();
      link.remove();
    },
    [getSpriteDataUrl]
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

  return {
    getImgCode,
    exportSpriteToImage,
    getSpriteDataUrl,
  };
};
