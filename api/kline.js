export default async function handler(req, res) {
  const { symbol = "BTCUSDT" } = req.query;

  try {
    // =========================
    // 1. COBA BINANCE
    // =========================
    const binance = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=100`
    );

    if (binance.ok) {
      const raw = await binance.json();

      const candles = raw.map((c) => ({
        time: c[0] / 1000,
        open: +c[1],
        high: +c[2],
        low: +c[3],
        close: +c[4],
      }));

      return res.status(200).json({
        success: true,
        source: "binance",
        data: candles,
      });
    }

    throw new Error("Binance failed");

  } catch (err) {
    console.warn("BINANCE FAIL → fallback:", err.message);

    try {
      // =========================
      // 2. FALLBACK: COINGECKO
      // =========================
      const cg = await fetch(
        "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1"
      );

      const data = await cg.json();

      const candles = data.prices.slice(-100).map((p, i, arr) => {
        const price = p[1];
        return {
          time: Math.floor(p[0] / 1000),
          open: price,
          high: price,
          low: price,
          close: price,
        };
      });

      return res.status(200).json({
        success: true,
        source: "coingecko",
        data: candles,
      });

    } catch (err2) {
      console.error("ALL API FAIL:", err2.message);

      // =========================
      // 3. LAST FALLBACK (DUMMY)
      // =========================
      const now = Math.floor(Date.now() / 1000);

      const dummy = Array.from({ length: 100 }).map((_, i) => ({
        time: now - (100 - i) * 60,
        open: 67000,
        high: 67100,
        low: 66900,
        close: 67050,
      }));

      return res.status(200).json({
        success: true,
        source: "dummy",
        data: dummy,
      });
    }
  }
}
