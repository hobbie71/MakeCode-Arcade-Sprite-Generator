import {
  createContext,
  SetStateAction,
  useMemo,
  useState,
  Dispatch,
} from "react";
import { SelectionArea } from "@/types/pixel";

type SelectionAreaContextType = {
  selectionArea: SelectionArea | null;
  setSelectionArea: Dispatch<SetStateAction<SelectionArea | null>>;
};

const SelectionAreaContext = createContext<
  undefined | SelectionAreaContextType
>(undefined);

export const SelectionAreaProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectionArea, setSelectionArea] = useState<SelectionArea | null>(
    null
  );

  const contextValue = useMemo(
    () => ({
      selectionArea,
      setSelectionArea,
    }),
    [selectionArea]
  );

  return (
    <SelectionAreaContext.Provider value={contextValue}>
      {children}
    </SelectionAreaContext.Provider>
  );
};

export { SelectionAreaContext };
