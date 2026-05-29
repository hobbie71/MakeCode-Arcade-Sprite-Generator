import { app } from "./app";
import { config } from "./config";

console.log(`MakeCode Arcade Sprite Generator API listening on ${config.HOST}:${config.PORT}`);

// Bun serves a default export with { port, fetch }.
export default {
  port: config.PORT,
  hostname: config.HOST,
  fetch: app.fetch,
};
