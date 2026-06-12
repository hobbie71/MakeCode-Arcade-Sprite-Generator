import type { Coordinates } from "../../../../types/pixel";
import { createStateContext } from "../../../../context/createStateContext";

const { Context: MouseCoordinatesContext, Provider: MouseCoordinatesProvider } =
  createStateContext<Coordinates | null>(null);

export { MouseCoordinatesContext, MouseCoordinatesProvider };
