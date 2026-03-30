
export async function getMarketData() {
  const [binance, coinbase, bybit] = await Promise.all([
    fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT").then(r => r.json()),
    fetch("https://api.coinbase.com/v2/prices/BTC-USD/spot").then(r => r.json()),
    fetch("https://api.bybit.com/v5/market/tickers?category=linear&symbol=BTCUSDT").then(r => r.json())
  ]);

  const data = {
    binance: parseFloat(binance.price),
    coinbase: parseFloat(coinbase.data.amount),
    bybit: parseFloat(bybit.result.list[0].lastPrice)
  };

  const prices = Object.values(data);
  return {
    exchanges: data,
    avg: prices.reduce((a,b)=>a+b,0)/prices.length,
    max: Math.max(...prices),
    min: Math.min(...prices),
    spread: Math.max(...prices) - Math.min(...prices)
  };
}
