let ws;
export function startOrderBook(symbol, onUpdate) {
  if (ws) ws.close();
  ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth20@100ms`);
  ws.onmessage = (e) => {
    const d = JSON.parse(e.data);
    const bids = d.bids.map(b => ({ price: +b[0], size: +b[1] }));
    const asks = d.asks.map(a => ({ price: +a[0], size: +a[1] }));
    onUpdate({ bids, asks });
  };
}
