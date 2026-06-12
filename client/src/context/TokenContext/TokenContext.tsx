import { createContext, useMemo, useState } from "react";

/**
 * Display-only token-balance stub (ADR-0006).
 *
 * The redesign reserves a UI slot for a future "watch an ad to earn a token"
 * economy, but builds NO token logic now: nothing here is spent, persisted, or
 * server-verified. `balance` is mock data (matches the mockup's "★ 3"), and
 * `watchAdToEarnToken` is a no-op placeholder. The real rewarded-video + ledger
 * work is tracked separately and is out of scope for this redesign.
 */
type TokenContextType = {
  /** Mock display balance. Not authoritative — do not gate paid calls on it. */
  balance: number;
  /** Display helper: whether the (mock) balance would allow a generation. */
  canGenerate: boolean;
  /** Placeholder for the future rewarded-ad flow. No-op for now. */
  watchAdToEarnToken: () => void;
};

const TokenContext = createContext<undefined | TokenContextType>(undefined);

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  // Static mock balance; intentionally not wired to generation (no economy yet).
  const [balance] = useState<number>(3);

  const contextValue = useMemo<TokenContextType>(
    () => ({
      balance,
      canGenerate: balance > 0,
      watchAdToEarnToken: () => {
        // No-op placeholder — the rewarded-ad + token ledger is future work.
      },
    }),
    [balance]
  );

  return (
    <TokenContext.Provider value={contextValue}>
      {children}
    </TokenContext.Provider>
  );
};

export { TokenContext };
