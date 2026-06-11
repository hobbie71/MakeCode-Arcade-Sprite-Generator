import { createContext, useMemo, useState } from "react";

interface RightDockContextValue {
  /** The id of the right-dock section currently shown (e.g. "palette", "source"). */
  activeSection: string;
  /** Switch the active right-dock section. Used both by the dock's own tabs and
   *  by flows outside the editor (e.g. Resize & Process opens "source" on Apply). */
  setActiveSection: (id: string) => void;
}

const RightDockContext = createContext<RightDockContextValue | undefined>(
  undefined,
);

/**
 * Holds which right-dock tab is active so that flows OUTSIDE the editor's local
 * provider tree (the Resize & Process modal, which lives in StudioPage) can
 * reveal a panel — e.g. jumping to the Source panel once re-processing applies.
 * Provided in StudioPage so both the dock (deep in SpriteEditor) and the modals
 * (siblings of SpriteEditor) share one source of truth.
 */
export function RightDockProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeSection, setActiveSection] = useState<string>("palette");
  const value = useMemo(
    () => ({ activeSection, setActiveSection }),
    [activeSection],
  );
  return (
    <RightDockContext.Provider value={value}>
      {children}
    </RightDockContext.Provider>
  );
}

export { RightDockContext };
