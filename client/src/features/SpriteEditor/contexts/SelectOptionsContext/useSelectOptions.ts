import { useContext } from "react";

import { SelectOptionsContext } from "./SelectOptionsContext";

export const useSelectOptions = () => {
  const context = useContext(SelectOptionsContext);

  if (context === undefined) {
    throw new Error(
      "useSelectOptions must be used within a SelectOptionsProvider"
    );
  }

  return context;
};
