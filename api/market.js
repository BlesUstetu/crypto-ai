export default async function handler(req, res) {
  try {
    console.log("MARKET API HIT")

    const response = await fetch(
      "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
    )

    if (!response.ok) {
      throw new Error("Binance API error")
    }

    const data = await response.json()

    return res.status(200).json({
      success: true,
      symbol: data.symbol,
      price: parseFloat(data.price),
      time: Date.now(),
    })

  } catch (err) {
    console.error("MARKET ERROR:", err.message)

    return res.status(500).json({
      success: false,
      error: err.message,
    })
  }
}
