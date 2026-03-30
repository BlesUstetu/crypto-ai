async function safeFetch(url, parser) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    return parser(data);

  } catch (err) {
    console.error("FETCH FAIL:", url, err.message);
    return null;
  }
}

export async function getMarketData() {
  const [binance, coinbase, bybit] = await Promise.allSettled([
    safeFetch(
      "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT",
      (d) => parseFloat(d.price)
    ),
    safeFetch(
      "https://api.coinbase.com/v2/prices/BTC-USD/spot",
      (d) => parseFloat(d.data?.amount)
    ),
    safeFetch(
      "https://api.bybit.com/v5/market/tickers?category=linear&symbol=BTCUSDT",
      (d) => parseFloat(d.result?.list?.[0]?.lastPrice)
    )
  ]);

  const data = {
    binance: binance.status === "fulfilled" ? binance.value : null,
    coinbase: coinbase.status === "fulfilled" ? coinbase.value : null,
    bybit: bybit.status === "fulfilled" ? bybit.value : null,
  };

  // =========================
  // FILTER VALID PRICE
  // =========================
  const prices = Object.values(data).filter(
    (p) => typeof p === "number" && !isNaN(p)
  );

  // =========================
  // FALLBACK kalau semua gagal
  // =========================
  if (prices.length === 0) {
    throw new Error("All market sources failed");
  }

  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  const max = Math.max(...prices);
  const min = Math.min(...prices);

  return {
    exchanges: data,
    avg,
    max,
    min,
    spread: max - min,
    sources: prices.length
  };
}
