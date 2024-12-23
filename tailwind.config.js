/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        md: "850px",
      },
      colors: {
        primary: "#2e75a8",
        secondary: "#93bfeb",
        tertiary: "#0f65a3",
      },
    },
  },
  plugins: [],
};
