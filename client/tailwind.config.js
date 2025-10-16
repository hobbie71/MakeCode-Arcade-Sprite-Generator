/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark theme colors (default)
        "bg-dark": "oklch(0.1 0.03 209)",
        bg: "oklch(0.15 0.03 209)",
        "bg-light": "oklch(0.2 0.03 209)",
        text: "oklch(0.96 0.06 209)",
        "text-muted": "oklch(0.60 0.06 209)",
        highlight: "oklch(0.5 0.06 209)",
        border: "oklch(0.4 0.06 209)",
        "border-muted": "oklch(0.3 0.06 209)",

        // Theme-aware colors with light mode variants
        primary: {
          400: "oklch(0.55 0.1 209)",
          500: "oklch(0.60 0.1 209)", // Dark theme primary
          600: "oklch(0.65 0.1 209)",
          // Light theme override
          light: "oklch(0.4 0.1 209)",
        },
        secondary: {
          400: "oklch(0.55 0.1 29)",
          500: "oklch(0.60 0.1 29)", // Dark theme secondary
          600: "oklch(0.65 0.1 29)",
          // Light theme override
          light: "oklch(0.4 0.1 29)",
        },
        danger: {
          400: "oklch(0.65 0.06 30)",
          500: "oklch(0.7 0.06 30)", // Using OKLCH for consistency
          600: "oklch(0.75 0.06 30)",
          light: "oklch(0.5 0.06 30)",
        },
        warning: {
          400: "oklch(0.65 0.06 100)",
          500: "oklch(0.7 0.06 100)",
          600: "oklch(0.75 0.06 100)",
          light: "oklch(0.5 0.06 100)",
        },
        success: {
          400: "oklch(0.65 0.06 160)",
          500: "oklch(0.7 0.06 160)",
          600: "oklch(0.75 0.06 160)",
          light: "oklch(0.5 0.06 160)",
        },
        info: {
          400: "oklch(0.65 0.06 260)",
          500: "oklch(0.7 0.06 260)",
          600: "oklch(0.75 0.06 260)",
          light: "oklch(0.5 0.06 260)",
        },

        // Light theme specific colors
        light: {
          "bg-dark": "oklch(0.92 0.03 209)",
          bg: "oklch(0.96 0.03 209)",
          "bg-light": "oklch(1 0.03 209)",
          text: "oklch(0.15 0.06 209)",
          "text-muted": "oklch(0.4 0.06 209)",
          highlight: "oklch(1 0.06 209)",
          border: "oklch(0.6 0.06 209)",
          "border-muted": "oklch(0.7 0.06 209)",
        },
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
