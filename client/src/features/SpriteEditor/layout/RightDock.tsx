import { useState } from "react";

export type DockSection = {
  id: string;
  label: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
};

/**
 * Collapsible right dock. Takes a list of sections so future panels (layers,
 * animation frames, AI variations, history) append with zero structural changes.
 *
 * - `lg` and up: a docked column on the right that can collapse to a thin strip.
 * - Below `lg`: the column is hidden; a floating "Palette" tab opens the same
 *   sections as a dismissible bottom-sheet so the palette stays reachable on
 *   tablet/phone (down to 390px).
 */
export default function RightDock({ sections }: { sections: DockSection[] }) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeId, setActiveId] = useState(sections[0]?.id);
  const [sheetOpen, setSheetOpen] = useState(false);
  const active = sections.find((s) => s.id === activeId) ?? sections[0];

  const tabs = (
    <div className="flex gap-1">
      {sections.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => setActiveId(s.id)}
          className={`rounded-md px-2 py-1 text-sm font-medium transition-colors ${
            active?.id === s.id
              ? "bg-accent-soft text-accent"
              : "text-ink-muted hover:bg-surface-hover"
          }`}>
          {s.label}
        </button>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop docked column (lg and up) */}
      <div
        className={`hidden flex-col border-l border-line bg-surface-raised transition-all lg:flex ${
          collapsed ? "w-10" : "w-72"
        }`}>
        {collapsed ? (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            aria-label="Expand panel"
            className="m-2 rounded-md p-1.5 text-ink-muted transition-colors hover:bg-surface-hover">
            ‹
          </button>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-line px-2 py-1.5">
              {tabs}
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                aria-label="Collapse panel"
                className="rounded-md p-1 text-ink-muted transition-colors hover:bg-surface-hover">
                ›
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">{active?.content}</div>
          </>
        )}
      </div>

      {/* Mobile/tablet trigger (below lg): floating tab on the right edge */}
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        aria-label={`Open ${active?.label ?? "panel"}`}
        aria-expanded={sheetOpen}
        className="fixed right-0 top-1/2 z-30 flex -translate-y-1/2 items-center gap-1.5 rounded-l-chip border border-r-0 border-line bg-surface-raised px-2.5 py-2 text-sm font-medium text-ink shadow-md transition-colors hover:bg-surface-hover lg:hidden">
        <span aria-hidden>🎨</span>
        <span className="[writing-mode:vertical-rl] rotate-180">
          {active?.label ?? "Palette"}
        </span>
      </button>

      {/* Mobile/tablet bottom-sheet (below lg) */}
      {sheetOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close panel"
            onClick={() => setSheetOpen(false)}
            className="absolute inset-0 bg-ink/30"
          />
          {/* Sheet */}
          <div className="absolute inset-x-0 bottom-0 flex max-h-[75vh] flex-col rounded-t-card border-t border-line bg-surface-raised shadow-lg">
            <div className="flex items-center justify-between border-b border-line px-3 py-2">
              {tabs}
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                aria-label="Close panel"
                className="rounded-md p-1 text-ink-muted transition-colors hover:bg-surface-hover">
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">{active?.content}</div>
          </div>
        </div>
      )}
    </>
  );
}
