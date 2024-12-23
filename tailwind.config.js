/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "850px",
    },
    extend: {
      colors: {
        primary: "#2e75a8",
        secondary: "#93bfeb",
        tertiary: "#0f65a3",
      },
    },
  },
  plugins: [],
};
