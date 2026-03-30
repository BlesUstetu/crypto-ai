export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
    )

    if (!response.ok) {
      return res.status(500).json({
        error: "Failed to fetch Binance API",
      })
    }

    const data = await response.json()

    return res.status(200).json({
      price: data.price,
      symbol: data.symbol,
    })

  } catch (error) {
    console.error("API ERROR:", error)

    return res.status(500).json({
      error: "Internal Server Error",
      detail: error.message,
    })
  }
}
