let ws;
export function startWS(symbol, onUpdate) {
  if (ws) ws.close();
  ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`);
  let buy = 0, sell = 0;

  ws.onmessage = (e) => {
    const d = JSON.parse(e.data);
    const price = parseFloat(d.p);
    const qty = parseFloat(d.q);
    const isSell = d.m;
    if (isSell) sell += qty; else buy += qty;
    onUpdate({ price, buy, sell, delta: buy - sell });
  };
}
