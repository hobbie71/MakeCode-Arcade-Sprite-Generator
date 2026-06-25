import { test, expect, describe } from "bun:test";
import { runWithAdGate } from "./runWithAdGate";

const tick = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe("runWithAdGate", () => {
  test("starts the ad immediately (concurrent with work)", async () => {
    let adStarted = false;
    await runWithAdGate(Promise.resolve("img"), () => {
      adStarted = true;
      return Promise.resolve();
    });
    expect(adStarted).toBe(true);
  });

  test("does not resolve until BOTH the work and the ad settle", async () => {
    let adDone = false;
    const ad = tick(20).then(() => {
      adDone = true;
    });
    const result = await runWithAdGate(Promise.resolve("img"), () => ad);
    expect(adDone).toBe(true); // ad finished before the gate resolved
    expect(result).toBe("img"); // returns the work's value
  });

  test("still returns the work value if the ad rejects (ad must never block delivery)", async () => {
    const result = await runWithAdGate(Promise.resolve("img"), () =>
      Promise.reject(new Error("ad fail")),
    );
    expect(result).toBe("img");
  });
});
