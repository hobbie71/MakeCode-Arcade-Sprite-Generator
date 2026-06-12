import { useContext } from "react";
import { SourceGhostContext } from "./SourceGhostContext";

export const useSourceGhost = () => {
  const context = useContext(SourceGhostContext);
  if (!context)
    throw new Error("useSourceGhost must be inside <SourceGhostProvider>");
  return context;
};
