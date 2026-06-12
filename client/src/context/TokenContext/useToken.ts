import { useContext } from "react";
import { TokenContext } from "./TokenContext";

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) throw new Error("useToken must be inside <TokenProvider>");
  return context;
};
