import SpriteDataResizer from "./components/SpriteDataResizer";
import SelectionShortcuts from "./components/SelectionShortcuts";
import ToolOptionsStrip from "./layout/ToolOptionsStrip";
import LeftRail from "./layout/LeftRail";
import CanvasStage from "./layout/CanvasStage";
import RightDock from "./layout/RightDock";
import PalettePanel from "./layout/PalettePanel";
import SourcePanel from "./layout/SourcePanel";
import {
  PaletteIcon,
  SourceIcon,
  LayersIcon,
  AnimationIcon,
  HistoryIcon,
} from "./layout/DockTabIcons";
import { useRightDock } from "../../context/RightDockContext/useRightDock";

interface Props {
  onOpenGenerate: () => void;
  onOpenResize: () => void;
  onOpenExport: () => void;
}

/**
 * The editor shell: a contextual tool-options strip on top, then the three
 * regions — left tool rail, central canvas stage (with floating actions), and the
 * collapsible right dock (Palette and Source tabs today; layers/frames/variations/history later).
 * No editing logic lives here — only render location.
 */
export default function EditorSurface({
  onOpenGenerate,
  onOpenResize,
  onOpenExport,
}: Props) {
  const { activeSection, setActiveSection } = useRightDock();
  return (
    <div className="flex h-full min-h-0 flex-col">
      <ToolOptionsStrip />
      <div className="flex min-h-0 flex-1">
        <LeftRail />
        <CanvasStage
          onOpenGenerate={onOpenGenerate}
          onOpenResize={onOpenResize}
          onOpenExport={onOpenExport}
        />
        <RightDock
          activeId={activeSection}
          onActiveChange={setActiveSection}
          sections={[
            {
              id: "palette",
              label: "Palette",
              icon: <PaletteIcon />,
              content: <PalettePanel />,
              defaultOpen: true,
            },
            {
              id: "source",
              label: "Source",
              icon: <SourceIcon />,
              content: (
                <SourcePanel
                  onOpenGenerate={onOpenGenerate}
                  onOpenResize={onOpenResize}
                />
              ),
            },
            // Placeholder tabs — disabled with a "coming soon" tooltip until the
            // panels land (see CONTEXT.md / visual-spec: future dock sections).
            {
              id: "layers",
              label: "Layers",
              icon: <LayersIcon />,
              content: null,
              comingSoon: true,
            },
            {
              id: "animation",
              label: "Animation",
              icon: <AnimationIcon />,
              content: null,
              comingSoon: true,
            },
            {
              id: "history",
              label: "History",
              icon: <HistoryIcon />,
              content: null,
              comingSoon: true,
            },
          ]}
        />
      </div>
      {/* Logic-only: keeps spriteData in sync with the canvas size. */}
      <SpriteDataResizer />
      {/* Logic-only: selection keyboard bindings (Esc/Enter/Delete/arrows). */}
      <SelectionShortcuts />
    </div>
  );
}
