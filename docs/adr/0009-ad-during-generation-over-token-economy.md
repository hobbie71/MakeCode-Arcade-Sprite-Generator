---
status: accepted
---

# Monetize with an ad shown during generation; defer the token economy

The app's paid OpenAI endpoint is unguarded and earns almost nothing from display ads, while its audience is a *mixed* one that skews young (MakeCode Arcade). Vault research designed a full rewarded-video **token economy** (Path A): anonymous device IDs, a Turso + Drizzle ledger, a server-side spend gate, and a signed ayeT server-to-server reward callback. We are **not** building that now. Instead we ship **Path B**: an ayeT on-demand video ad plays while a sprite generates, a *soft client-side gate* reveals the sprite only after the ad finishes, ads are **non-personalized for every user**, and a lightweight in-memory per-IP rate limit bounds the endpoint — **no database, no identity, no ledger, no callback**.

## Why

- **The token economy is premature.** Its only real justification is *future* features (multi-image batches, full animations) that need metered, bankable usage — and those don't exist yet. Building a database + ledger + secure callback now is a week of work for a feature with no current caller (YAGNI).
- **The rewarded-revenue premium is pennies at this scale.** At ~200 users the higher per-ad rate of a *gated* rewarded flow doesn't justify the database it requires. ayeT still pays per completed view without the reward callback.
- **What actually stops the bleed is the gate + rate limit, not ad income.** Today every generation is unbounded free cost; an ad-per-generation plus a per-IP cap moves the app toward break-even regardless of ad ARPU.
- **Non-personalized-for-everyone sidesteps COPPA age-gating.** If no user is ever profiled, there is no under-13 personal-data collection to consent-gate, so no age screen is needed. Combined with rewarded-video-only (no offerwall) and category blocks, it's the most defensible posture for a young-skewing mixed audience — pending a lawyer review against the current COPPA rule.

## Considered options

- **Path A — full token economy (rejected for now):** Turso + Drizzle ledger, device IDs, server spend gate, signed ayeT S2S callback. Bounded cost + rewarded-tier revenue + future-ready, but a week of DB work before the features that need it exist. **Preserved as the deferred spec** in `CONTEXT.md` (Monetization, deferred) for the batch/animation PR.
- **Google AdSense instead of ayeT:** brand-safer with native child-directed/non-personalized support, but its web formats can't cleanly play a fullscreen video on demand during the loading wait. Kept as the **documented fallback** if ayeT can't serve on-demand-without-reward or its ToS bans the traffic.

## Consequences

- Partially supersedes ADR-0006's reserved token-balance UI slot: the mock `TokenContext` and `★` chip are removed now and rebuilt later.
- Light, reversible vendor coupling to ayeT (the SDK wrapper exposes a vendor-neutral `showRewardedAd()` interface).
- Two launch gates live outside the code: ayeT ToS/format verification and a lawyer hour on the COPPA stance (see `docs/design/monetization-implementation-plan.md`).
