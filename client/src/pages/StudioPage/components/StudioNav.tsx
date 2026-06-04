import { Link } from "react-router-dom";
import Button from "../../../components/Button";
import { useToken } from "../../../context/TokenContext/useToken";

interface Props {
  onOpenExport: () => void;
}

/** Studio top bar: wordmark, document title, the display-only token chip, Export. */
export default function StudioNav({ onOpenExport }: Props) {
  const { balance } = useToken();

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

      <div className="hidden min-w-0 items-center gap-1.5 text-sm sm:flex">
        <span className="truncate text-ink">Untitled sprite</span>
        <span className="shrink-0 text-ink-subtle">· saved locally</span>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <span
          className="flex items-center gap-1 rounded-pill border border-line px-2.5 py-1 text-sm font-medium text-ink"
          title="Token balance (display only)">
          <span className="text-accent">★</span>
          {balance}
        </span>
        <Button onClick={onOpenExport}>Export</Button>
      </div>
    </header>
  );
}
