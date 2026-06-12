import { createStateContext } from "../../../../context/createStateContext";

/**
 * When on (and the pencil stroke size is 1), the pencil removes the L-shaped
 * "corner" pixels that a mouse produces on diagonals, leaving clean 1px lines.
 */
const { Context: PixelPerfectContext, Provider: PixelPerfectProvider } =
  createStateContext<boolean>(false);

export { PixelPerfectContext, PixelPerfectProvider };
