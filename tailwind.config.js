/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "musify-blue": "#1d1d1d",
        "musify-dark": "#111",
        "musify-light": "#0e0e6a",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
