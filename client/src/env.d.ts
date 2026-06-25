interface Window {
  adsbygoogle?: unknown[];
}

// Side-effect CSS imports (e.g. `import "./base.css"`, `import "prismjs/themes/prism.css"`).
// Previously provided by Vite's `vite/client` ambient types.
declare module "*.css";

// Build-time env vars inlined by Bun's bundler (literal `process.env.X` reads only).
// `process` does not exist at runtime in the browser — these reads are replaced with
// string literals at build (dev: bunfig [serve.static] env; prod: `bun build --env='VITE_*'`).
declare const process: {
  readonly env: {
    readonly VITE_API_URL?: string;
    readonly VITE_GOOGLE_AD_CLIENT_ID?: string;
    readonly VITE_SQUARE_AD_SLOT_ID?: string;
    readonly VITE_AYET_PLACEMENT_ID?: string;
    readonly VITE_AYET_ADSLOT?: string;
    readonly VITE_DEV?: string;
  };
};
