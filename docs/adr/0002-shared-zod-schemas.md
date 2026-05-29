---
status: accepted
---

# Shared Zod schemas as the single source of truth for the wire contract

The client and server previously hand-mirrored their types — Pydantic models in Python and TypeScript types/enums in the client, kept in sync manually. With both sides now on TypeScript (ADR-0001), we define the client/server wire contract once as Zod schemas in a shared workspace package. The client derives static types via `z.infer`; the server validates incoming request bodies with the same schemas, restoring the runtime validation that was lost when Pydantic was dropped. It becomes structurally impossible for the two sides to disagree, because they are the same object.

Only the **wire contract** lives in `shared/`: the request/response schemas and the enums whose string values cross the network (`AssetType`, `Style`, the generation enums, quality enums). UI display metadata stays in the client — the `ALL_*` label arrays, the palette colour maps (`ArcadePalette`, etc.), and `EditorTools` — so React/UI concerns never leak into the server's dependency graph. The palette crosses the wire as a generic `Record<string,string>`, so only the *type* `MakeCodePalette` is shared, not the palette data.

## Considered Options

- **Plain shared TS types** — simplest, but types erase at runtime, leaving the server with no validation on a public, pay-per-call endpoint.
- **Hono RPC end-to-end inference** — couples the client build to the server's internal route types; more machinery than the simple fetch layer needs.
- **Zod single source** (chosen) — one definition yields both the static type and the runtime validator.

## Consequences

- Validating user input at the door rejects junk with a clean 422 before spending a paid OpenAI/PixelLab call.
- Zod is a runtime dependency on both client and server.
- Wire-crossing enums become Zod enums; UI-only enums and catalogs remain plain client code.
