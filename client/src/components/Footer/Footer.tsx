import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface-raised px-4 py-6 text-center text-2xs text-ink-subtle">
      <nav className="flex items-center justify-center gap-4">
        <Link to="/privacy" className="hover:text-ink">
          Privacy
        </Link>
        <Link to="/terms" className="hover:text-ink">
          Terms
        </Link>
      </nav>
      <p className="mt-2">© MakeSpriteCode</p>
    </footer>
  );
}
