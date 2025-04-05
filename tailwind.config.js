/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem",
      },
      colors: {
        light: "#fff",
        text: "#11181C",
        dark: "#151718",
        darkText: "#ECEDEE",

        primary: "#4893ff",
      },
    },
  },
  plugins: [],
};
