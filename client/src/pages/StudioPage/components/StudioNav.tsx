import { Link } from "react-router-dom";
import Button from "../../../components/Button";

interface Props {
  onOpenExport: () => void;
}

/** Studio top bar: wordmark, Export. */
export default function StudioNav({ onOpenExport }: Props) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-line bg-surface-raised px-4 sm:px-6">
      <Link to="/" className="flex shrink-0 items-center gap-2.5">
        <img
          src="/favicon.svg"
          alt="MakeSpriteCode logo"
          className="h-7 w-7 rounded-md"
        />
        <span className="text-lg font-bold text-ink">
          MakeSprite<span className="text-accent">Code</span>
        </span>
      </Link>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Link
          to="/privacy"
          className="text-2xs text-ink-subtle hover:text-ink"
        >
          Privacy
        </Link>
        <Link to="/terms" className="text-2xs text-ink-subtle hover:text-ink">
          Terms
        </Link>
        <Button onClick={onOpenExport}>Export</Button>
      </div>
    </header>
  );
}
