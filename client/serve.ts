// Minimal all-Bun static server for the built client (client/dist), used by the
// production container (ADR-0005). Serves hashed assets + copied public files,
// with an SPA fallback to index.html for client-side routes.
import { join, normalize, sep } from "node:path";

const DIST = join(import.meta.dir, "dist");
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

Bun.serve({
  port: PORT,
  hostname: HOST,
  async fetch(req) {
    const url = new URL(req.url);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith("/")) pathname += "index.html";

    // Resolve under DIST and guard against path traversal (anchor to a
    // separator so e.g. `/app/dist-evil` can't pass a bare startsWith check).
    const candidate = normalize(join(DIST, pathname));
    if (candidate === DIST || candidate.startsWith(DIST + sep)) {
      const f = Bun.file(candidate);
      if (await f.exists()) return new Response(f);
    }

    // SPA fallback.
    return new Response(Bun.file(join(DIST, "index.html")), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
});

console.log(`Static client server listening on ${HOST}:${PORT} (serving ${DIST})`);
