import { useContext } from "react";
import { HistoryContext } from "./HistoryContext";

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) throw new Error("useHistory must be inside <HistoryProvider>");
  return context;
};
