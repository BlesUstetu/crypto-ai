export default async function handler(req, res) {
  try {
    const { symbol = "BTCUSDT", interval = "1m" } = req.query

    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Failed fetch kline")
    }

    const raw = await response.json()

    const candles = raw.map((c) => ({
      time: c[0] / 1000,
      open: parseFloat(c[1]),
      high: parseFloat(c[2]),
      low: parseFloat(c[3]),
      close: parseFloat(c[4]),
    }))

    return res.status(200).json({
      success: true,
      data: candles,
    })

  } catch (err) {
    console.error("KLINE ERROR:", err)

    return res.status(500).json({
      success: false,
      error: err.message,
    })
  }
}
