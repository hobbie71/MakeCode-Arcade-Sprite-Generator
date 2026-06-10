import { useState } from "react";
import Backdrop from "../../../components/Backdrop";
import Button from "../../../components/Button";
import IconButton from "../../../components/IconButton";

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
        <Button
          key={s.id}
          variant="chip"
          pressed={active?.id === s.id}
          onClick={() => setActiveId(s.id)}>
          {s.label}
        </Button>
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
          <IconButton
            size="sm"
            onClick={() => setCollapsed(false)}
            aria-label="Expand panel"
            className="m-2 text-ink-muted">
            ‹
          </IconButton>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-line px-2 py-1.5">
              {tabs}
              <IconButton
                size="sm"
                onClick={() => setCollapsed(true)}
                aria-label="Collapse panel"
                className="text-ink-muted">
                ›
              </IconButton>
            </div>
            <div className="flex-1 overflow-y-auto p-3">{active?.content}</div>
          </>
        )}
      </div>

      {/* Mobile/tablet trigger (below lg): floating tab on the right edge */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setSheetOpen(true)}
        aria-label={`Open ${active?.label ?? "panel"}`}
        aria-expanded={sheetOpen}
        className="fixed right-0 top-1/2 z-30 -translate-y-1/2 gap-1.5 rounded-l-chip rounded-r-none border-r-0 px-2.5 shadow-md lg:hidden">
        <span aria-hidden>🎨</span>
        <span className="[writing-mode:vertical-rl] rotate-180">
          {active?.label ?? "Palette"}
        </span>
      </Button>

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
                className="text-ink-muted">
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
