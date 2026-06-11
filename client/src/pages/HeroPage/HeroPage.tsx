import { useNavigate } from "react-router-dom";
import { useHasVisited } from "../../hooks/useHasVisited";
import Button from "../../components/Button";
import HeroEntryWidget from "./components/HeroEntryWidget";
import ExampleGallery from "./components/ExampleGallery";
import HowItWorks from "./components/HowItWorks";

const FEATURES = [
  "Completely free",
  "No account needed",
  "Paste into MakeCode Arcade",
];

const NAV_LINKS = [
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
 * inline GenerationControls widget. The "/" route always shows the hero — even for
 * returning visitors — so the marketing page is never auto-skipped.
 */
export default function HeroPage() {
  const navigate = useNavigate();
  const { markVisited } = useHasVisited();

  const enterStudio = () => {
    markVisited();
    navigate("/studio");
  };

  // Upload/generate on the hero stages a source (no canvas commit) and routes
  // into the studio asking it to open Resize & Process for that source.
  const enterStudioWithResize = () => {
    markVisited();
    navigate("/studio", { state: { openResize: true } });
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-2">
            <img
              src="/favicon.svg"
              alt="MakeSpriteCode logo"
              className="h-7 w-7 rounded-md"
            />
            <span className="text-lg font-bold text-ink">
              MakeSprite<span className="text-accent">Code</span>
            </span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-medium text-ink-muted transition-colors hover:text-ink">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/hobbie71/MakeCode-Arcade-Sprite-Generator"
              target="_blank"
              rel="noreferrer"
              aria-label="View source on GitHub"
              title="View source on GitHub"
              className="flex h-9 w-9 items-center justify-center rounded-card text-ink transition-colors hover:bg-surface-raised">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
            <Button size="sm" onClick={enterStudio}>
              Open Studio →
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:gap-16 lg:py-20">
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

        <HeroEntryWidget
          onStaged={enterStudioWithResize}
          onBlank={enterStudio}
        />
      </section>

      <ExampleGallery onExplore={enterStudio} />
      <HowItWorks />

      {/* CTA */}
      <section className="flex justify-center px-6 pb-20 pt-4">
        <Button size="lg" onClick={enterStudio}>
          ✦ Open the studio (it's free)
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2">
              <img
                src="/favicon.svg"
                alt="MakeSpriteCode logo"
                className="h-6 w-6 rounded-md"
              />
              <span className="font-bold text-ink">
                MakeSprite<span className="text-accent">Code</span>
              </span>
            </span>
            <span className="hidden text-ink-subtle sm:inline">·</span>
            <span className="text-ink-muted">
              Not affiliated with Microsoft or MakeCode Arcade.
            </span>
          </div>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              href="https://arcade.makecode.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-ink-muted transition-colors hover:text-ink">
              MakeCode Arcade
            </a>
            <a
              href="https://forms.gle/RMooZuywkBVUQwtw8"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-ink-muted transition-colors hover:text-ink">
              Report an issue
            </a>
            <a
              href="https://github.com/hobbie71/MakeCode-Arcade-Sprite-Generator"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-ink-muted transition-colors hover:text-ink">
              GitHub
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
