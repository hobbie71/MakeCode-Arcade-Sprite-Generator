// client/src/pages/TermsPage/TermsPage.tsx
//
// ⚠️ Starter boilerplate, NOT legal advice — the pre-launch lawyer review must
// vet this copy. Replace CONTACT_EMAIL with the real support address before
// launch (see the monetization plan's pre-launch checklist).
export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 text-ink">
      <h1 className="text-h2 font-bold">Terms of Service</h1>
      <p className="mt-2 text-ink-subtle">Last updated: 2026-06-25</p>

      <h2 className="mt-6 text-h3 font-semibold">Using MakeSpriteCode</h2>
      <p className="mt-2">
        MakeSpriteCode is a free tool for creating pixel-art sprites for MakeCode
        Arcade. Use it lawfully. Do not submit prompts that are illegal, hateful,
        sexual, or that infringe others' rights; prompts are screened and may be
        rejected.
      </p>

      <h2 className="mt-6 text-h3 font-semibold">Ads</h2>
      <p className="mt-2">
        Generation is supported by short, non-personalized video ads. Ad
        availability is not guaranteed and ads are provided by third parties.
      </p>

      <h2 className="mt-6 text-h3 font-semibold">No warranty</h2>
      <p className="mt-2">
        The service is provided "as is", without warranties of any kind. Generated
        images may not be unique; you are responsible for how you use them.
      </p>

      <h2 className="mt-6 text-h3 font-semibold">Contact</h2>
      <p className="mt-2">
        <a className="text-accent underline" href="mailto:CONTACT_EMAIL">
          CONTACT_EMAIL
        </a>
      </p>
    </main>
  );
}
