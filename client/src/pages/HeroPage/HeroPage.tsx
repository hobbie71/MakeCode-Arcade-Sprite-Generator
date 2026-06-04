import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useHasVisited } from "../../hooks/useHasVisited";

/**
 * Marketing hero + inline entry widget (ADR-0006 hybrid hero).
 *
 * PLACEHOLDER for now — the full hero (value prop, example gallery, how-it-works
 * and the GenerationControls entry widget) is built in Phase 8. Returning
 * visitors are redirected straight to /studio (expert-skip).
 */
export default function HeroPage() {
  const navigate = useNavigate();
  const { visited, markVisited } = useHasVisited();

  useEffect(() => {
    if (visited) navigate("/studio", { replace: true });
  }, [visited, navigate]);

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center gap-6 p-6 text-center bg-surface">
      <h1 className="text-display font-bold text-ink max-w-3xl leading-tight">
        Turn any image into a{" "}
        <span className="text-accent">MakeCode sprite</span>
      </h1>
      <p className="text-ink-muted max-w-xl text-lg">
        Describe it in words or upload a photo. Free, instant, no account.
      </p>
      <Link
        to="/studio"
        onClick={markVisited}
        className="btn-primary rounded-pill px-6 py-3 text-base">
        Open Studio →
      </Link>
    </main>
  );
}
