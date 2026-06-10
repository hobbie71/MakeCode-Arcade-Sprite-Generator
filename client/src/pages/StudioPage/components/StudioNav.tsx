import { Link } from "react-router-dom";
import Button from "../../../components/Button";
import { useToken } from "../../../context/TokenContext/useToken";

interface Props {
  onOpenExport: () => void;
  onOpenTokens: () => void;
}

/** Studio top bar: wordmark, the display-only token chip, Export. */
export default function StudioNav({ onOpenExport, onOpenTokens }: Props) {
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

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Button
          variant="chip"
          onClick={onOpenTokens}
          className="gap-1 rounded-pill text-ink"
          title="Generation tokens">
          <span className="text-accent">★</span>
          {balance}
        </Button>
        <Button onClick={onOpenExport}>Export</Button>
      </div>
    </header>
  );
}
