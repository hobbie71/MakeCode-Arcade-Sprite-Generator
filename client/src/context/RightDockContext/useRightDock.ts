import { useContext } from "react";
import { RightDockContext } from "./RightDockContext";

export const useRightDock = () => {
  const context = useContext(RightDockContext);
  if (context === undefined) {
    throw new Error("useRightDock must be used within a RightDockProvider");
  }
  const { value: activeSection, setValue: setActiveSection } = context;
  return { activeSection, setActiveSection };
};
