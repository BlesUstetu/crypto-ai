
export default {
  content: ["./index.html", "./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b0f14",
        card: "rgba(255,255,255,0.05)",
        border: "rgba(255,255,255,0.1)",
        buy: "#00ff9d",
        sell: "#ff4d4f"
      },
      boxShadow: {
        buy: "0 0 20px #00ff9d",
        sell: "0 0 20px #ff4d4f"
      }
    }
  },
  plugins: []
}
