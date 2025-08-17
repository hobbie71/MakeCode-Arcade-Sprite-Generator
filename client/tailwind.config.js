/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        makecode: {
          transparent: "transparent",
          white: "#ffffff",
          red: "#ff2121",
          pink: "#ff93c4",
          orange: "#ff8135",
          yellow: "#fff609",
          teal: "#249ca3",
          green: "#78dc52",
          blue: "#003fad",
          lightblue: "#87ceeb",
          purple: "#8b2635",
          lightpurple: "#bc5cd7",
          darkpurple: "#401353",
          tan: "#d2b48c",
          brown: "#654321",
          black: "#000000",
        },
      },
      gridTemplateColumns: {
        "sprite-16": "repeat(16, minmax(0, 1fr))",
        "sprite-32": "repeat(32, minmax(0, 1fr))",
      },
      spacing: {
        sprite: "20px",
      },
    },
  },
  plugins: [],
};
