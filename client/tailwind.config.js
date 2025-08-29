/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0fdff",
          100: "#ccf7fe",
          200: "#99eefd",
          300: "#60defa",
          400: "#22c5f0",
          500: "#058b9b", // Main primary color
          600: "#087984", // Shadow color
          700: "#0c6b75",
          800: "#105a62",
          900: "#144b52",
        },
        secondary: {
          400: "#9ca3af", // Hover color
          500: "#6b7280", // Main secondary color
          600: "#4b5563", // Shadow color
        },
        danger: {
          400: "#ef4444", // Hover color
          500: "#dc2626", // Main danger color
          600: "#b91c1c", // Shadow color
        },
        focus: "#0078d4",
        "focus-dark": "#005fa3",
      },
    },
  },
  plugins: [],
};
