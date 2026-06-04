import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHasVisited } from "../../hooks/useHasVisited";
import HeroEntryWidget from "./components/HeroEntryWidget";
import ExampleGallery from "./components/ExampleGallery";
import HowItWorks from "./components/HowItWorks";

const FEATURES = [
  "Completely free",
  "No account needed",
  "Paste into MakeCode Arcade",
];

const NAV_LINKS = [
  { label: "Features", href: "#how-it-works" },
  { label: "Gallery", href: "#gallery" },
  { label: "How it works", href: "#how-it-works" },
];

function CheckIcon() {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent">
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M5 13l4 4L19 7"
        />
      </svg>
    </span>
  );
}

/**
 * Hybrid hero (ADR-0006): markets the product AND lets you act immediately via the
 * inline GenerationControls widget. Returning visitors skip straight to /studio.
 */
export default function HeroPage() {
  const navigate = useNavigate();
  const { visited, markVisited } = useHasVisited();

  useEffect(() => {
    if (visited) navigate("/studio", { replace: true });
  }, [visited, navigate]);

  const enterStudio = () => {
    markVisited();
    navigate("/studio");
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-accent font-pixel text-[10px] text-on-accent">
            M
          </span>
          <span className="text-lg font-bold text-ink">
            MakeSprite<span className="text-accent">Code</span>
          </span>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-ink-muted transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>
        <button
          onClick={enterStudio}
          className="btn-primary rounded-pill px-4 py-2 text-sm">
          Open Studio →
        </button>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:py-20">
        <div>
          <h1 className="text-display font-bold leading-tight text-ink">
            Turn any image into a{" "}
            <span className="text-accent">MakeCode sprite</span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-ink-muted">
            Describe it in words or upload a photo. MakeSpriteCode generates clean
            pixel art on the Arcade palette, lets you fine-tune every pixel, and
            copies straight into your game. Free, instant, no account.
          </p>
          <ul className="mt-6 space-y-2">
            {FEATURES.map((f) => (
              <li
                key={f}
                className="flex items-center gap-3 rounded-card border border-line bg-surface-raised px-4 py-3 text-sm font-medium text-ink shadow-sm">
                <CheckIcon />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <HeroEntryWidget onSuccess={enterStudio} />
      </section>

      <ExampleGallery />
      <HowItWorks />

      {/* CTA */}
      <section className="px-6 py-12 text-center">
        <button
          onClick={enterStudio}
          className="btn-primary rounded-pill px-6 py-3 text-base">
          ✦ Open the studio — it's free
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-8 text-center text-sm text-ink-subtle sm:flex-row sm:justify-between">
          <span className="font-bold text-ink-muted">
            MakeSprite<span className="text-accent">Code</span>
          </span>
          <span>Not affiliated with Microsoft or MakeCode Arcade.</span>
        </div>
      </footer>
    </div>
  );
}
