import { useContext } from "react";
import { ErrorContext } from "./ErrorContext";

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) throw new Error("useError must be inside <ErrorProvider>");
  return context;
};
