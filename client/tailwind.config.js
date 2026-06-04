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
        // State colors: DEFAULT + soft (new), plus 400/500/600 legacy aliases.
        success: {
          DEFAULT: "var(--success)",
          soft: "var(--success-soft)",
          400: "var(--success)",
          500: "var(--success)",
          600: "var(--success)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          soft: "var(--warning-soft)",
          400: "var(--warning)",
          500: "var(--warning)",
          600: "var(--warning)",
        },
        danger: {
          DEFAULT: "var(--danger)",
          soft: "var(--danger-soft)",
          400: "var(--danger)",
          500: "var(--danger)",
          600: "var(--danger)",
        },
        info: {
          DEFAULT: "var(--info)",
          400: "var(--info)",
          500: "var(--info)",
          600: "var(--info)",
        },

        // ────────────────────────────────────────────────────────────────
        // Legacy aliases — TRANSITIONAL. The old dark "default-*" scale was
        // backgrounds (dark) + "text-default-*" was text (light). Repointing
        // them to light surfaces / dark text IS the dark→light flip, so the
        // pre-redesign components render correctly in light theme with no
        // per-component edits. Remove these in Phase 9 once every legacy user
        // is deleted or migrated to the semantic tokens above.
        // ────────────────────────────────────────────────────────────────
        default: {
          100: "var(--surface-sunken)",
          200: "var(--surface)",
          300: "var(--surface-raised)",
          400: "var(--surface-hover)",
          "light-100": "var(--surface-raised)",
          "light-200": "var(--surface-sunken)",
          "light-300": "var(--surface-hover)",
        },
        "text-default": {
          100: "var(--text-subtle)",
          200: "var(--text-muted)",
          300: "var(--text)",
          muted: "var(--text-muted)",
          "light-100": "var(--text)",
          "light-200": "var(--text-muted)",
          "light-300": "var(--text-subtle)",
          "light-muted": "var(--text-subtle)",
        },
        primary: {
          400: "var(--accent-hover)",
          500: "var(--accent)",
          600: "var(--accent-press)",
        },
      },
      boxShadow: {
        // Legacy names repointed to the new (light) shadows.
        "default-sm": "var(--shadow-sm)",
        "default-md": "var(--shadow-md)",
        "default-lg": "var(--shadow-lg)",
        // Semantic (override Tailwind's default sm/md/lg with the branded set).
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
      },
    },
  },
  plugins: [],
};
