// Test preload (registered after happydom.ts in bunfig.toml). React Testing
// Library auto-registers an afterEach(cleanup) only when it detects a Jest-style
// global afterEach at import time; under Bun's runner that detection doesn't
// fire, so renders would leak into document.body across tests (duplicate
// elements break getByRole/getByText). We register the cleanup explicitly here,
// once, for every client test file.
import { afterEach } from "bun:test";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});
