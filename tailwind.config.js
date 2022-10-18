/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        lexend: ['"Lexend"', "sans-serif"],
        saira: ['"Saira"', "sans-serif"],
        quicksand: ['"Quicksand"', "sans-serif"],
        poppins: ['"Poppins"', "sans-serif"],
        canava: ['"Ubuntu"', "sans-serif"],
        amaline: ['"Cinzel"', "serif"],
        roboto: ['"Roboto"', "sans-serif"],
      },
      backgroundImage: {
        "dash-dark": "url('/wideBg.png')",
        "prismatics": "url('/prismatics/bg.png')",
      },
      colors: {
        green: {
          DEFAULT: "#03DD03",
          50: "#9AFE9A",
          100: "#86FD86",
          200: "#5EFD5E",
          300: "#35FC35",
          400: "#0DFC0D",
          500: "#03DD03",
          600: "#02A602",
          700: "#016E01",
          800: "#013701",
          900: "#000000",
        },
      },
      
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"), // add this to your plugins
  ],
};
