import { useShapeTool } from "./useShapeTool";
import {
  getSquareCoordinates,
  getFilledSquareCoordinates,
} from "../libs/getShapeCoordinates";

export const useRectangle = () =>
  useShapeTool({
    previewKey: "drawSquarePreview",
    getOutlineCoordinates: getSquareCoordinates,
    getFilledCoordinates: getFilledSquareCoordinates,
  });
