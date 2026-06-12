// Runtime configuration, ported from app/core/config.py. Bun auto-loads the
// nearest .env, so process.env is already populated when this module runs.

/** Replicates the Python CORS_ORIGINS parsing: a JSON array literal (with single
 *  or double quotes), else a comma-separated list, else []. */
export function parseCorsOrigins(raw: string | undefined): string[] {
  if (!raw) return [];
  try {
    if (raw.startsWith("[") && raw.endsWith("]")) {
      return JSON.parse(raw.replace(/'/g, '"')) as string[];
    }
    return raw.split(",").map((origin) => origin.trim());
  } catch (e) {
    console.warn(`Warning: Failed to parse CORS_ORIGINS: ${e}`);
    return [];
  }
}

export const config = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "",
  CORS_ORIGINS: parseCorsOrigins(process.env.CORS_ORIGINS),
  DEBUG: (process.env.DEBUG ?? "false").toLowerCase() === "true",
  ENVIRONMENT: process.env.ENVIRONMENT ?? "development",
  HOST: process.env.HOST ?? "0.0.0.0",
  PORT: Number(process.env.PORT) || 8000,
};
