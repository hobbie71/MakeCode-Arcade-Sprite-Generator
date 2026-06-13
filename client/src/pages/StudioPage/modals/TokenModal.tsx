import Modal from "../../../components/Modal/Modal";
import Button from "../../../components/Button";
// import { useToken } from "../../../context/TokenContext/useToken";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// /** Small filled play triangle (matches the solid ★ / bolt icon style). */
// function PlayIcon({ className = "" }: { className?: string }) {
//   return (
//     <svg
//       className={className}
//       viewBox="0 0 24 24"
//       fill="currentColor"
//       aria-hidden="true"
//     >
//       <path d="M8 5v14l11-7z" />
//     </svg>
//   );
// }

/**
 * "Generation tokens" modal — opened from the display-only token chip in
 * StudioNav.
 *
 * Currently a "Coming soon" announcement. The original placeholder token UI
 * (balance card + watch-ad-to-earn flow, ADR-0006) is commented out below —
 * restore it once the rewarded-video flow + token ledger ship (see
 * TokenContext).
 */
export default function TokenModal({ isOpen, onClose }: Props) {
  // const { balance, watchAdToEarnToken } = useToken();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" title="Generation tokens">
      <div className="flex flex-col items-center px-2 py-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-accent-border bg-accent-soft">
          <span className="text-3xl text-accent">★</span>
        </div>

        <span className="mt-5 rounded-pill border border-line px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Coming soon
        </span>

        <h3 className="mt-3 text-h3 font-bold text-ink">
          Generation tokens are on the way
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">
          Soon, each AI generation will use tokens. You can earn them by
          watching short ads. Ads are optional. Until then, generate as much as
          you want.
        </p>

        <Button className="mt-6 w-full max-w-xs py-2.5" onClick={onClose}>
          Got it
        </Button>
      </div>
    </Modal>
  );

  // ── Original placeholder token UI (pre–coming-soon) ──────────────────────
  // return (
  //   <Modal
  //     isOpen={isOpen}
  //     onClose={onClose}
  //     size="md"
  //     title="Generation tokens"
  //     subtitle="Each AI generation uses 1 token."
  //   >
  //     {/* Current balance */}
  //     <div className="flex items-center gap-4 rounded-card border border-accent-border bg-accent-soft p-4">
  //       <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-line bg-surface-raised">
  //         <span className="text-2xl text-accent">★</span>
  //       </div>
  //       <div className="min-w-0">
  //         <div className="text-4xl font-bold leading-none text-ink">
  //           {balance}
  //         </div>
  //         <div className="mt-1.5 text-sm text-ink-muted">tokens available</div>
  //       </div>
  //     </div>
  //
  //     {/* Earn-a-token explainer */}
  //     <div className="mt-5 flex gap-3">
  //       <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-raised text-ink-subtle">
  //         <PlayIcon className="h-4 w-4" />
  //       </div>
  //       <div className="min-w-0">
  //         <h3 className="text-base font-semibold text-ink">
  //           Watch a short ad to earn 1 token
  //         </h3>
  //         <p className="mt-1 text-sm text-ink-muted">
  //           Ads are completely optional. By choosing to watch, you agree to view
  //           a short advertisement. You can close it anytime — you&apos;ll earn
  //           the token only once the ad finishes.
  //         </p>
  //       </div>
  //     </div>
  //
  //     {/* Primary action — placeholder, wired to the no-op watchAdToEarnToken. */}
  //     <Button
  //       variant="outline"
  //       className="mt-5 w-full gap-2 py-3"
  //       onClick={watchAdToEarnToken}
  //     >
  //       <PlayIcon className="h-4 w-4" />
  //       Watch ad to earn 1 token
  //     </Button>
  //
  //     <button
  //       type="button"
  //       onClick={onClose}
  //       className="mt-3 w-full text-center text-sm font-medium text-ink-muted transition-colors hover:text-ink"
  //     >
  //       No thanks
  //     </button>
  //   </Modal>
  // );
}
