---
status: accepted
---

# Backend rewritten in Bun + TypeScript with Hono

The original backend was a FastAPI (Python) service, but it is a thin, stateless proxy: three endpoints (OpenAI image generation, PixelLab image generation, prompt moderation), no database, no auth, no file storage. It has essentially no Python lock-in — OpenAI has a first-class JS SDK, PixelLab is a plain REST API, and the only Python-native dependency (Pillow) is a no-op re-encode. We rewrite it in Bun + TypeScript using Hono so the frontend and backend share one language and one toolchain, which is what makes a single shared type source (see ADR-0002) possible without codegen.

## Considered Options

- **Keep FastAPI/Python** — type sharing would require Pydantic → OpenAPI → generated TS, a build step that drifts. Rejected: it blocks the real goal (true type unity).
- **Elysia** (Bun-native) — fastest, best type inference, but couples us to Bun and a younger ecosystem.
- **Raw `Bun.serve`** — zero dependencies, but we'd hand-roll routing/CORS/error handling on a live app.
- **Hono** (chosen) — mature, runtime-agnostic (portable off Bun/Render later with no rewrite), FastAPI-equivalent ergonomics.

## Consequences

- Dropping Pydantic removes runtime request validation. TS types vanish at runtime, so request bodies must be validated explicitly (see ADR-0002 for the Zod decision).
- This is a behavior-preserving rewrite of a live revenue app with no test suite — parity must be characterized before cutover, not assumed.
