import { useEffect, useState } from "react";
import Backdrop from "../../../components/Backdrop";
import Button from "../../../components/Button";
import IconButton from "../../../components/IconButton";
import Tooltip from "../../../components/Tooltip";

export type DockSection = {
  id: string;
  label: string;
  /** 16px glyph shown on the tab (always visible); the label sits beside it. */
  icon: React.ReactNode;
  content: React.ReactNode;
  defaultOpen?: boolean;
  /** Placeholder tab: rendered disabled with a "coming soon" tooltip, never
      selectable, content never shown. */
  comingSoon?: boolean;
};

/**
 * A right-dock tab. Always the same element whether active or not — only its
 * classes change — so the label can animate its width open/closed on select
 * (see `.dock-tab` in tailwind.src.css) instead of remounting. Idle/disabled
 * tabs are icon-only with a tooltip; the active tab expands to icon + label.
 */
function DockTab({
  section,
  active,
  onSelect,
}: {
  section: DockSection;
  active: boolean;
  onSelect: () => void;
}) {
  const { label, icon, comingSoon } = section;
  return (
    <Tooltip
      // Active tab already shows its label, so suppress its bubble — but keep the
      // wrapper mounted so toggling active never remounts the button (which would
      // kill the expand animation).
      disabled={active}
      text={comingSoon ? `${label} — coming soon` : label}
      placement="bottom"
      className="">
      <Button
        variant="chip"
        className="dock-tab"
        pressed={comingSoon ? undefined : active}
        aria-disabled={comingSoon || undefined}
        aria-label={label}
        onClick={comingSoon ? undefined : onSelect}>
        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
          {icon}
        </span>
        <span className="dock-tab__label">
          <span>{label}</span>
        </span>
      </Button>
    </Tooltip>
  );
}

/**
 * Collapsed-rail icon: the same sections shown as a vertical icon strip when the
 * desktop dock is collapsed. Clicking re-expands the dock to that tab; disabled
 * placeholders show the "coming soon" tooltip.
 */
function DockRailIcon({
  section,
  active,
  onSelect,
}: {
  section: DockSection;
  active: boolean;
  onSelect: () => void;
}) {
  const { label, icon, comingSoon } = section;
  return (
    <Tooltip
      text={comingSoon ? `${label} — coming soon` : label}
      placement="left"
      className="">
      <IconButton
        size="md"
        pressed={comingSoon ? undefined : active}
        aria-disabled={comingSoon || undefined}
        aria-label={label}
        onClick={comingSoon ? undefined : onSelect}
        className={comingSoon ? "cursor-not-allowed opacity-40" : ""}>
        {icon}
      </IconButton>
    </Tooltip>
  );
}

/**
 * Collapsible right dock. Takes a list of sections so future panels (layers,
 * animation frames, AI variations, history) append with zero structural changes.
 *
 * - `lg` and up: a docked column on the right. Expanded shows the tab row + the
 *   active panel; collapsed shrinks to a vertical icon rail of the same tabs.
 * - Below `lg`: the column is hidden; a floating tab opens the same sections as a
 *   dismissible bottom-sheet so the dock stays reachable on tablet/phone (≥390px).
 */
export default function RightDock({
  sections,
  activeId: controlledActiveId,
  onActiveChange,
}: {
  sections: DockSection[];
  /** Controlled active-section id. When provided, the dock reflects this value
   *  and reports tab clicks via onActiveChange — letting flows outside the editor
   *  (e.g. Resize & Process revealing "source" on Apply) drive which tab is open.
   *  Omitted → the dock manages its own active tab internally. */
  activeId?: string;
  onActiveChange?: (id: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [internalActiveId, setInternalActiveId] = useState(sections[0]?.id);
  const activeId = controlledActiveId ?? internalActiveId;
  const selectSection = onActiveChange ?? setInternalActiveId;
  const [sheetOpen, setSheetOpen] = useState(false);
  const active = sections.find((s) => s.id === activeId) ?? sections[0];

  // When the active section changes — including programmatic switches from
  // outside the editor (Resize & Process jumps to "source" on Apply) — make sure
  // the desktop dock is expanded so the revealed panel is actually visible.
  useEffect(() => {
    setCollapsed(false);
  }, [activeId]);

  const tabs = (
    <div className="flex min-w-0 items-center gap-0.5">
      {sections.map((s) => (
        <DockTab
          key={s.id}
          section={s}
          active={active?.id === s.id}
          onSelect={() => selectSection(s.id)}
        />
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop docked column (lg and up) */}
      <div
        className={`hidden flex-col border-l border-line bg-surface-raised transition-all lg:flex ${
          collapsed ? "w-14" : "w-72"
        }`}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-1.5 py-2">
            <IconButton
              size="md"
              onClick={() => setCollapsed(false)}
              aria-label="Expand panel"
              className="text-lg text-ink-muted">
              ‹
            </IconButton>
            <span className="my-1 h-px w-8 bg-line" />
            {sections.map((s) => (
              <DockRailIcon
                key={s.id}
                section={s}
                active={active?.id === s.id}
                onSelect={() => {
                  selectSection(s.id);
                  setCollapsed(false);
                }}
              />
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-line px-2 py-1.5">
              {tabs}
              <IconButton
                size="md"
                onClick={() => setCollapsed(true)}
                aria-label="Collapse panel"
                className="shrink-0 text-lg text-ink-muted">
                ›
              </IconButton>
            </div>
            <div className="flex-1 overflow-y-auto p-3">{active?.content}</div>
          </>
        )}
      </div>

      {/* Mobile/tablet trigger (below lg): the same icon rail as the desktop
          collapsed dock, pinned to the right edge as an opaque panel so every
          section is visible at a glance (no rotated labels). Tapping a tab
          selects it and opens the bottom-sheet — where the full label + content
          live; coming-soon tabs stay muted and inert. Hidden while the sheet is
          open, since the backdrop covers the edge anyway. */}
      {!sheetOpen && (
        <div className="fixed right-0 top-1/2 z-30 flex -translate-y-1/2 flex-col items-center gap-1 rounded-l-card border border-r-0 border-line bg-surface-raised p-1.5 shadow-md lg:hidden">
          {sections.map((s) => (
            <DockRailIcon
              key={s.id}
              section={s}
              active={active?.id === s.id}
              onSelect={() => {
                selectSection(s.id);
                setSheetOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Mobile/tablet bottom-sheet (below lg) */}
      {sheetOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <Backdrop
            onDismiss={() => setSheetOpen(false)}
            aria-label="Close panel"
          />
          {/* Sheet */}
          <div className="absolute inset-x-0 bottom-0 flex max-h-[75vh] flex-col rounded-t-card border-t border-line bg-surface-raised shadow-lg">
            <div className="flex items-center justify-between border-b border-line px-3 py-2">
              {tabs}
              <IconButton
                size="sm"
                onClick={() => setSheetOpen(false)}
                aria-label="Close panel"
                className="shrink-0 text-ink-muted">
                ✕
              </IconButton>
            </div>
            <div className="flex-1 overflow-y-auto p-3">{active?.content}</div>
          </div>
        </div>
      )}
    </>
  );
}
