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
          50: "#fff5ef",
          100: "#ffe3d5",
          200: "#ffc2a8",
          300: "#ff9b6d",
          400: "#ff7a3d", // Hover color
          500: "#f66721", // Main secondary color
          600: "#c94f1a", // Shadow color
          700: "#a03e15",
          800: "#7a2f10",
          900: "#5c230c",
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
