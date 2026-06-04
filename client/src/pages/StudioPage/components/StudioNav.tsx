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
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-line bg-surface-raised px-4">
      <Link to="/" className="flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-accent font-pixel text-[10px] text-on-accent">
          M
        </span>
        <span className="text-lg font-bold text-ink">
          MakeSprite<span className="text-accent">Code</span>
        </span>
      </Link>

      <div className="hidden items-center gap-1.5 text-sm sm:flex">
        <span className="text-ink">Untitled sprite</span>
        <span className="text-ink-subtle">· saved locally</span>
      </div>

      <div className="flex items-center gap-3">
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
