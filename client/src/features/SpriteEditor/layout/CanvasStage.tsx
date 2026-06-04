import Canvas from "../components/Canvas";
import FloatingActionLayer from "./FloatingActionLayer";

interface Props {
  onOpenGenerate: () => void;
  onOpenResize: () => void;
  onOpenExport: () => void;
}

/** The big central stage: hosts the Canvas on the light stage backdrop, with the
 *  floating action layer absolutely positioned over it. */
export default function CanvasStage(props: Props) {
  return (
    <div className="relative min-w-0 flex-1 bg-stage">
      <Canvas />
      <FloatingActionLayer {...props} />
    </div>
  );
}
