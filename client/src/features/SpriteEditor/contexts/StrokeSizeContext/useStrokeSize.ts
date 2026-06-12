import { useContext } from "react";
import { StrokeSizeContext } from "./StrokeSizeContext";

export const useStrokeSize = () => {
  const context = useContext(StrokeSizeContext);
  if (!context)
    throw new Error("useStrokeSize must be inside <StrokeSizeProvider>");
  const { value: strokeSize, setValue: setStrokeSize } = context;
  return { strokeSize, setStrokeSize };
};
