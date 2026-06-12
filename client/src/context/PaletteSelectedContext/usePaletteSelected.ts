import { useContext } from "react";
import { PaletteSelectedContext } from "./PaletteSelectedContext";

export const usePaletteSelected = () => {
  const context = useContext(PaletteSelectedContext);
  if (!context)
    throw new Error(
      "usePaletteSelected must be inside <PaletteSelectedProvider>"
    );
  const { value: palette, setValue: setPalette } = context;
  return { palette, setPalette };
};
