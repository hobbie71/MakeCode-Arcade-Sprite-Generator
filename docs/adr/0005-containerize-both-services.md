---
status: accepted
---

# Both services containerized; root docker-compose for local orchestration

Both the client and the API are containerized — `client/Dockerfile` and `server/Dockerfile` — with a root `docker-compose.yml` so the whole app comes up with one `docker compose up`. We stay on Render. This overrides the earlier recommendation (Dockerize only the API, serve the frontend via Render's CDN static hosting): the maintainer values a single uniform container workflow and easy local orchestration over the frontend's CDN edge.

`docker-compose.yml` is for **local development only** — Render does not consume it. On Render, each service is its own Docker web service built from its own Dockerfile, declared as code in a root `render.yaml` blueprint so infra is reproducible and version-controlled rather than dashboard-configured.

## Considered Options

- **API-only Docker + CDN static frontend** — keeps the frontend on Render's global CDN edge; recommended for uptime/latency, rejected for tooling uniformity.
- **Both containerized** (chosen) — uniform workflow, one local command.

## Consequences

- The frontend is served from a regional Render container, not the global CDN edge — slightly slower global first-load and one more process to keep alive. Accepted as the trade for uniform tooling. The ADR-0004 decoupling still holds: separate images mean the site stays up independent of the API.
- Artifacts: `client/Dockerfile` (multi-stage — `bun build` static assets, then served by a minimal all-Bun static server to honor the Bun-only toolchain), `server/Dockerfile` (Bun + Hono), root `docker-compose.yml` (local), root `render.yaml` (prod IaC).
- The compose file and `render.yaml` describe the same two services and must be kept in sync.
