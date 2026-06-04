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
 * Hidden below `lg` (mirrors the old toolbox `hidden sm:block`).
 */
export default function RightDock({ sections }: { sections: DockSection[] }) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeId, setActiveId] = useState(sections[0]?.id);
  const active = sections.find((s) => s.id === activeId) ?? sections[0];

  return (
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
  );
}
