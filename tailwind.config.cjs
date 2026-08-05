/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0052CC",
        secondary: "#FFAB00",
        destructive: "#DE350B",
      },
    },
  },
  plugins: [],
}
