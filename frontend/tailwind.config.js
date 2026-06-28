/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', "sans-serif"],
        montserrat: ['"Montserrat"', "sans-serif"],
        dmsans: ['"DM Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
