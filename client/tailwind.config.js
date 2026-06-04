/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // ────────────────────────────────────────────────────────────────
        // Semantic tokens (the redesign system). All map to CSS vars defined
        // in src/base.css, so light/dark flips with [data-theme]. Use these.
        // ────────────────────────────────────────────────────────────────
        surface: {
          DEFAULT: "var(--surface)",
          raised: "var(--surface-raised)",
          sunken: "var(--surface-sunken)",
          hover: "var(--surface-hover)",
        },
        stage: "var(--canvas-stage)", // canvas backdrop
        ink: {
          DEFAULT: "var(--text)",
          muted: "var(--text-muted)",
          subtle: "var(--text-subtle)",
        },
        "on-accent": "var(--text-on-accent)",
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          press: "var(--accent-press)",
          contrast: "var(--accent-contrast)",
          soft: "var(--accent-soft)",
          "soft-2": "var(--accent-soft-2)",
          border: "var(--accent-border)",
          ring: "var(--accent-ring)",
        },
        line: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
          faint: "var(--border-faint)",
        },
        checker: {
          a: "var(--checker-a)",
          b: "var(--checker-b)",
        },
        // State colors
        success: {
          DEFAULT: "var(--success)",
          soft: "var(--success-soft)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          soft: "var(--warning-soft)",
        },
        danger: {
          DEFAULT: "var(--danger)",
          soft: "var(--danger-soft)",
        },
        info: "var(--info)",
      },
      boxShadow: {
        // Branded shadows (override Tailwind's default sm/md/lg).
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        accent: "var(--shadow-accent)",
      },
      borderRadius: {
        // Semantic radii (Tailwind defaults like rounded-lg stay available).
        card: "var(--radius-lg)",
        modal: "var(--radius-xl)",
        pill: "var(--radius-pill)",
        chip: "var(--radius-md)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
        pixel: ["var(--font-pixel)"],
      },
      fontSize: {
        // Display / heading scale from the mockup (Tailwind's text-sm…text-xl stay).
        display: ["var(--fs-display)", { lineHeight: "1.04", letterSpacing: "-0.03em" }],
        h1: ["var(--fs-h1)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        h2: ["var(--fs-h2)", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        h3: ["var(--fs-h3)", { lineHeight: "1.2" }],
        h4: ["var(--fs-h4)", { lineHeight: "1.3" }],
        "body-lg": ["var(--fs-body-lg)", { lineHeight: "1.6" }],
        "2xs": ["var(--fs-2xs)", { lineHeight: "1.4" }],
      },
    },
  },
  plugins: [],
};
