export default async function handler(req, res) {
  try {
    const { symbol = "BTCUSDT", interval = "1m" } = req.query;

    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=100`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const text = await response.text();
      console.error("BINANCE ERROR:", text);
      throw new Error("Binance API failed");
    }

    const raw = await response.json();

    if (!Array.isArray(raw)) {
      throw new Error("Invalid kline data");
    }

    const candles = raw.map((c) => ({
      time: Math.floor(c[0] / 1000),
      open: parseFloat(c[1]),
      high: parseFloat(c[2]),
      low: parseFloat(c[3]),
      close: parseFloat(c[4]),
    }));

    return res.status(200).json({
      success: true,
      data: candles,
    });

  } catch (err) {
    console.error("KLINE ERROR:", err.message);

    // 🔥 FALLBACK DATA (biar chart tetap tampil)
    const fallback = Array.from({ length: 50 }).map((_, i) => ({
      time: Math.floor(Date.now() / 1000) - (50 - i) * 60,
      open: 67000,
      high: 67100,
      low: 66900,
      close: 67050,
    }));

    return res.status(200).json({
      success: true,
      fallback: true,
      data: fallback,
      error: err.message,
    });
  }
}
