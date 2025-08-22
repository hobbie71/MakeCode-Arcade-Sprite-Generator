import {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";
import { Coordinates } from "@/types/pixel";

interface MouseCoordinatesContextType {
  mouseCoordinates: Coordinates | null;
  setMouseCoordinates: Dispatch<SetStateAction<Coordinates | null>>;
}

const MouseCoordinatesContext = createContext<
  MouseCoordinatesContextType | undefined
>(undefined);

export const MouseCoordinatesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mouseCoordinates, setMouseCoordinates] = useState<Coordinates | null>(
    null
  );

  const value = useMemo(
    () => ({
      mouseCoordinates,
      setMouseCoordinates,
    }),
    [mouseCoordinates]
  );

  return (
    <MouseCoordinatesContext.Provider value={value}>
      {children}
    </MouseCoordinatesContext.Provider>
  );
};

export { MouseCoordinatesContext };
