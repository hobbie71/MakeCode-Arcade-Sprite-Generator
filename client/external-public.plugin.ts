import type { BunPlugin } from "bun";

// Marks absolute-path public assets (favicons, web manifest, etc. — e.g.
// `/favicon.svg`, `/site.webmanifest`) as external, so Bun's HTML bundler leaves
// those URLs untouched instead of trying to resolve+bundle them. They are served
// verbatim from the site root
// (public/ is copied into dist/ by the build) — mirroring Vite's public/ directory.
//
// Shared by the production build (build.ts) and the dev server (bunfig.toml).
const externalPublicAssets: BunPlugin = {
  name: "external-public-assets",
  setup(build) {
    build.onResolve(
      { filter: /^\/.+\.(svg|png|ico|webmanifest|js)$/ },
      (args) => ({ path: args.path, external: true }),
    );
  },
};

export default externalPublicAssets;
