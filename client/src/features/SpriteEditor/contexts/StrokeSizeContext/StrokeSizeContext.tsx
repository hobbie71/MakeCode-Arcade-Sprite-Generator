import type { StrokeSize } from "../../../../types/pixel";
import { createStateContext } from "../../../../context/createStateContext";

const { Context: StrokeSizeContext, Provider: StrokeSizeProvider } =
  createStateContext<StrokeSize>(1);

export { StrokeSizeContext, StrokeSizeProvider };
