import { test, expect, describe } from "bun:test";

// Importing index.ts must NOT open a listening socket — it only assembles and
// exports the Bun server descriptor { port, hostname, fetch }. (The literal
// object is what `bun src/index.ts` hands to the runtime to serve.)
import server from "./index";

describe("server default export", () => {
  test("is an object with the Bun-serve shape", () => {
    expect(server).toBeTruthy();
    expect(typeof server).toBe("object");
  });

  test("port is a number", () => {
    expect(typeof server.port).toBe("number");
    expect(Number.isFinite(server.port)).toBe(true);
  });

  test("hostname is a string", () => {
    expect(typeof server.hostname).toBe("string");
    expect(server.hostname.length).toBeGreaterThan(0);
  });

  test("fetch is a function (the Hono app handler)", () => {
    expect(typeof server.fetch).toBe("function");
  });

  test("fetch handles a request without a live socket (GET / -> health payload)", async () => {
    const res = await server.fetch(new Request("http://localhost/"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      message: "MakeCode Arcade Sprite Generator API",
      version: "0.1.0",
    });
  });
});
