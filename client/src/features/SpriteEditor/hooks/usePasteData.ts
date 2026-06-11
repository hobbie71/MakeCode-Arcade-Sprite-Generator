import { useCallback } from "react";

// Context imports
import { useCanvas } from "../../../context/CanvasContext/useCanvas";
import { usePaletteSelected } from "../../../context/PaletteSelectedContext/usePaletteSelected";
import { useSprite } from "../../../context/SpriteContext/useSprite";
import { useHistory } from "../contexts/HistoryContext/useHistory";

// Lib imports
import { drawPixelOnCanvas } from "../libs/drawPixelOnCanvas";

import { useMakeCodeColorConverter } from "../../InputSection/hooks/useMakeCodeColorConverter";

// Type imports
import { MakeCodeColor } from "../../../types/color";

export const usePasteData = () => {
  const { canvasRef } = useCanvas();
  const { palette } = usePaletteSelected();
  const { setSpriteData } = useSprite();
  const { getSpriteDataFromCanvas } = useMakeCodeColorConverter();
  const { pushSnapshot } = useHistory();

  const pasteSpriteData = useCallback(
    (spriteData: MakeCodeColor[][]) => {
      if (!canvasRef.current) return;

      // Iterate the pasted data's OWN dimensions, not the current canvas size.
      // Callers (e.g. the Resize & Process modal) paste data sized to the *new*
      // dimensions before the canvas-size context has caught up, so keying the
      // loop off context width/height would clip or over-read the paste.
      const rows = spriteData.length;
      const cols = spriteData[0]?.length ?? 0;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          drawPixelOnCanvas(
            canvasRef.current,
            { x, y },
            spriteData[y][x],
            palette
          );
        }
      }

      setSpriteData(spriteData);
      pushSnapshot(spriteData);
    },
    [canvasRef, setSpriteData, palette, pushSnapshot]
  );

  const pasteCanvas = useCallback(
    (canvas: HTMLCanvasElement) => {
      const spriteData = getSpriteDataFromCanvas(canvas);
      pasteSpriteData(spriteData);
    },
    [getSpriteDataFromCanvas, pasteSpriteData]
  );

  return { pasteSpriteData, pasteCanvas };
};
