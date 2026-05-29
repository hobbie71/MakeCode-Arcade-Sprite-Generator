---
status: accepted
---

# Client and API deployed as two decoupled services

With the whole stack on Bun, `Bun.serve` could serve the static client and the API from a single process (one image, no CORS). We deliberately keep them as **two** services instead: the client is built with `bun build` and served from CDN-backed static hosting, and the Hono/Bun API runs as a separate web service.

The driver is uptime for an ad-supported app. The entire sprite editor is client-side — page load, editing, and code export need no backend; only AI generation calls the API. Decoupling means an API deploy, restart, or upstream (OpenAI/PixelLab) hiccup degrades *only* generation, while the site still loads, still serves ads, and the editor still works. A single process would couple the site's availability to the API's. It is also the smaller change from the existing two-service setup, lowering risk on a live app.

## Considered Options

- **Single `Bun.serve` process** — one Docker image, same-origin (CORS deleted), simplest topology, but the site shares fate with the API.
- **Two decoupled services** (chosen) — CDN frontend independent of API availability.

## Consequences

- CORS stays (client and API are different origins) — the CORS allow-list is kept, not deleted.
- Client and API are each their own image and deploy independently; the decoupling holds regardless of hosting mechanism. Both are containerized — see ADR-0005.
