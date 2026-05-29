# Characterization fixtures (Step 4)

Real request → response pairs captured from the **current Python/FastAPI server**
*before* the Bun/Hono rewrite. With no test suite, these are the behavior oracle
the Step 5 Bun tests validate against. Captured by replaying `requests/*.json`
against `uvicorn app.main:app` on a live machine with production API keys.

## Endpoints

| Fixture | Endpoint | Result |
|---|---|---|
| `moderation-benign`  | `POST /moderation/moderate` | `is_appropriate: true` |
| `moderation-violent` | `POST /moderation/moderate` | `flagged: true` (violence score 0.83) |
| `openai-generate`    | `POST /generate-image/openai` | ✅ 1024×1024 PNG data URL (gpt-image-1.5) |

> The app is OpenAI-only (PixelLab was removed on `main`), so only the OpenAI
> generation + moderation endpoints are characterized.

## Oracle for Step 5

- **Requests** (`requests/*.json`) are replayed verbatim against the Bun server.
- **Moderation** responses are the deterministic-ish oracle: same prompt → same
  `flagged`/`is_appropriate` and near-identical category scores. The custom rule
  (`violence === true && score < 0.5 → not flagged`) is **not** exercised by these
  two fixtures (the violent prompt scores 0.83, above the 0.5 threshold), so it is
  verified against the source logic, not a recorded sample.
- **Image** responses are non-deterministic; the oracle is the **shape**: a
  `data:image/png;base64,<...>` string + numeric `width`/`height`. The OpenAI
  square request (16×16, aspect 1.0) yields a 1024×1024 image, confirming
  `getOpenAIFinalSize` (square branch). `samples/openai-dragon.png` is a decoded sample.

## Notable findings

- **Moderation `categories`/`category_scores` contain BOTH key formats** — snake_case
  (`harassment_threatening`) *and* slash (`harassment/threatening`) — an artifact of
  the Python OpenAI SDK model dump. The JS OpenAI SDK returns slash keys only; the
  client consumes only `is_appropriate`, so the Bun rewrite emits the SDK-native
  shape and does not reproduce the duplicated keys.
