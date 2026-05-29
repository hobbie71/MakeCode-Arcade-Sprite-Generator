// Production build for the client (replaces `vite build`).
// Bun's HTML bundler resolves every local asset reference relative to the HTML
// file and tries to bundle+hash it. Our favicons, web manifest, and AdSense
// recovery scripts live in public/ and are referenced by absolute URL
// (`/favicon.svg`, `/site.webmanifest`, ...). The plugin below marks those
// absolute asset paths as external so Bun leaves the URLs untouched; we then
// copy public/ into dist/ (see package.json "build") so they resolve at the
// site root at runtime — mirroring Vite's public/ directory behavior.
import { rm } from "node:fs/promises";
import externalPublicAssets from "./external-public.plugin.ts";

await rm("./dist", { recursive: true, force: true });

const result = await Bun.build({
  entrypoints: ["./index.html"],
  outdir: "./dist",
  minify: true,
  sourcemap: "linked",
  env: "VITE_*",
  plugins: [externalPublicAssets],
});

if (!result.success) {
  console.error("Client build failed:");
  for (const log of result.logs) console.error(log);
  process.exit(1);
}

console.log(`Client build succeeded: ${result.outputs.length} output(s) in dist/`);
