import { useContext } from "react";
import { FillOptionsContext } from "./FillOptionsContext";

export const useFillOptions = () => {
  const context = useContext(FillOptionsContext);
  if (!context)
    throw new Error("useFillOptions must be inside <FillOptionsProvider>");
  const { value: fillAll, setValue: setFillAll } = context;
  return { fillAll, setFillAll };
};
