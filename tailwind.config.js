export default {
  content: [
    "./index.html",
    "./main.jsx",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./store/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0b0f14",
        card: "rgba(255,255,255,0.04)",
        border: "rgba(255,255,255,0.08)",

        buy: "#00c896",     // lebih readable
        sell: "#ff4d4f",

        chartBg: "#0b0f14",
        chartGrid: "rgba(255,255,255,0.05)"
      },

      boxShadow: {
        buy: "0 0 12px rgba(0,200,150,0.6)",
        sell: "0 0 12px rgba(255,77,79,0.6)"
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      }
    }
  },
  plugins: []
}
