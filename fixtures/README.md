# Test fixtures

Request bodies and recorded API responses used by the server's Bun tests
(`server/src/*.test.ts`). Originally captured from the production API during the
Bun migration; they now serve as regression test data.

## Used by the tests
- `requests/openai-generate.json` — a sample image-generation request body;
  `prompt.test.ts` builds the prompt from it and asserts the exact output.
- `responses/moderation-{benign,violent}.json` — real moderation responses;
  `moderation-logic.test.ts` checks the `violence < 0.5` override against them.

## Reference (not imported by tests)
- `requests/moderation-*.json` — the prompts that produced the moderation responses.
- `responses/openai-generate.json` — the image-response **shape**. The body itself
  is non-deterministic (every generation differs), so only the shape
  (`data:image/png;base64,…` + `width`/`height`) and the observed dimensions are
  recorded — e.g. a 16×16 square request yields a 1024×1024 image.
