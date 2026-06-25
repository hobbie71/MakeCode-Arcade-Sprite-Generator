// client/src/pages/PrivacyPage/PrivacyPage.tsx
//
// ⚠️ Starter boilerplate, NOT legal advice — the pre-launch lawyer review must
// vet this copy. It discloses third-party ad cookies (ayeT) because ad networks
// require a published privacy policy. Replace CONTACT_EMAIL with the real support
// address before launch (see the monetization plan's pre-launch checklist).
export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 text-ink">
      <h1 className="text-h2 font-bold">Privacy Policy</h1>
      <p className="mt-2 text-ink-subtle">Last updated: 2026-06-25</p>

      <h2 className="mt-6 text-h3 font-semibold">What we collect</h2>
      <p className="mt-2">
        MakeSpriteCode has no accounts and no login. We do not ask for your name,
        email, or any personal details to use the sprite generator. Prompts you
        submit are sent to our image provider solely to generate your sprite.
      </p>

      <h2 className="mt-6 text-h3 font-semibold">Advertising</h2>
      <p className="mt-2">
        A short video ad from ayeT-Studios may play while your sprite generates.
        We serve <strong>non-personalized (contextual) ads only</strong> — ads are
        not targeted to you based on a profile. Ad providers may set cookies or
        identifiers for frequency capping and fraud prevention. See ayeT-Studios'
        privacy policy for their practices.
      </p>

      <h2 className="mt-6 text-h3 font-semibold">Children</h2>
      <p className="mt-2">
        This is a general-audience tool. Because some visitors may be under 13, we
        serve non-personalized ads to everyone and do not knowingly collect personal
        information from children.
      </p>

      <h2 className="mt-6 text-h3 font-semibold">Contact</h2>
      <p className="mt-2">
        Questions:{" "}
        <a className="text-accent underline" href="mailto:CONTACT_EMAIL">
          CONTACT_EMAIL
        </a>
      </p>
    </main>
  );
}
