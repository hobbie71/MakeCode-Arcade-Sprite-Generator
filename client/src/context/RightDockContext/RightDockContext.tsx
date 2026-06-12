import { createStateContext } from "../createStateContext";

/**
 * Holds which right-dock tab is active so that flows OUTSIDE the editor's local
 * provider tree (the Resize & Process modal, which lives in StudioPage) can
 * reveal a panel — e.g. jumping to the Source panel once re-processing applies.
 * Provided in StudioPage so both the dock (deep in SpriteEditor) and the modals
 * (siblings of SpriteEditor) share one source of truth.
 *
 * The value is the id of the right-dock section currently shown (e.g.
 * "palette", "source"); the setter switches sections and is used both by the
 * dock's own tabs and by flows outside the editor (e.g. Resize & Process opens
 * "source" on Apply).
 */
const { Context: RightDockContext, Provider: RightDockProvider } =
  createStateContext<string>("palette");

export { RightDockContext, RightDockProvider };
