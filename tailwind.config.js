/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        luxury: ['"Italiana"', 'serif'],
        technical: ['"Space Grotesk"', 'sans-serif'],
        display: ['"Syne"', 'sans-serif'],
      },
      colors: {
        vault: {
          bg: "#090a0c",
          gold: "#D4AF37",
          champagne: "#E5D3B3",
          steel: "#8E9299",
          border: "rgba(255, 255, 255, 0.08)",
          subtle: "rgba(255, 255, 255, 0.45)",
        }
      }
    },
  },
  plugins: [],
}