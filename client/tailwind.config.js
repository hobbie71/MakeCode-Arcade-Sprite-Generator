/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark theme colors (default)
        default: {
          100: "oklch(0.1 0 209)",
          200: "oklch(0.15 0 209)",
          300: "oklch(0.2 0 209)",
          "light-100": "oklch(0.8 0 209)",
          "light-200": "oklch(0.85 0 209)",
          "light-300": "oklch(0.9 0 209)",
        },

        "text-default": {
          100: "oklch(0.75 0 209)",
          200: "oklch(0.85 0 209)",
          300: "oklch(0.95 0 209)",
          muted: "oklch(0.6 0 209)",
          "light-100": "oklch(0.1 0 209)",
          "light-200": "oklch(0.15 0 209)",
          "light-300": "oklch(0.2 0 209)",
          "light-muted": "oklch(0.4 0 209)",
        },

        primary: {
          400: "oklch(0.55 0.1 209)",
          500: "oklch(0.60 0.1 209)", // Dark theme primary
          600: "oklch(0.65 0.1 209)",
        },

        danger: {
          400: "oklch(0.65 0.2 30)",
          500: "oklch(0.7 0.2 30)",
          600: "oklch(0.75 0.2 30)",
        },

        warning: {
          400: "oklch(0.65 0.2 100)",
          500: "oklch(0.7 0.2 100)",
          600: "oklch(0.75 0.2 100)",
        },

        success: {
          400: "oklch(0.65 0.2 160)",
          500: "oklch(0.7 0.2 160)",
          600: "oklch(0.75 0.2 160)",
        },

        info: {
          400: "oklch(0.65 0.2 260)",
          500: "oklch(0.7 0.2 260)",
          600: "oklch(0.75 0.2 260)",
        },
      },
      boxShadow: {
        "default-sm":
          "inset 0 1px 2px #ffffff30, 0 1px 2px #00000030, 0 2px 4px #00000015",
        "default-md":
          "inset 0 1px 2px #ffffff50, 0 1px 2px #00000030, 0 2px 4px #00000015",
        "default-lg":
          "inset 0 1px 2px #ffffff70, 0 1px 2px #00000030, 0 2px 4px #00000015",
      },
    },
  },
  plugins: [
    // Plugin to handle light theme variants
    function ({ addVariant }) {
      addVariant("light", "body.light &");
    },
  ],
};
