// Dev server for the client (replaces a bare `bun index.html`).
//
// Bun's HTML dev server uses index.html as an SPA fallback for *every* path, so a
// request for `/favicon.svg` (or any other public/ asset) returns the HTML page
// instead of the file — the favicons, web manifest, and AdSense scripts all 404
// as broken assets during local dev. Production doesn't hit this because the build
// copies public/ into dist/ (see package.json "build" + build.ts), so the files
// resolve at the site root at runtime.
//
// This server closes that gap: it serves public/ at the site root *and* keeps the
// bundled SPA (with HMR) behind it, mirroring production. Bundling, env inlining
// (VITE_*), and the external-public plugin still come from bunfig.toml's
// [serve.static] block, exactly as `bun index.html` relied on them.
import { readdirSync } from "node:fs";
import { join } from "node:path";
import index from "./index.html";

const PUBLIC = join(import.meta.dir, "public");
const PORT = Number(process.env.PORT) || 3000;

// Snapshot public/ into static routes. Static routes outrank the "/*" SPA
// wildcard by specificity, so `/favicon.svg` serves the real file while `/studio`
// (and any other client route) still falls through to the bundled SPA. New files
// added to public/ require a dev-server restart — same as production's copy step.
const publicRoutes: Record<string, Response> = {};
for (const entry of readdirSync(PUBLIC, { withFileTypes: true })) {
  if (entry.isFile()) {
    publicRoutes[`/${entry.name}`] = new Response(Bun.file(join(PUBLIC, entry.name)));
  }
}

const server = Bun.serve({
  port: PORT,
  development: { hmr: true, console: true },
  routes: {
    ...publicRoutes,
    "/*": index,
  },
});

console.log(`Client dev server running at ${server.url} (serving public/ + SPA)`);
