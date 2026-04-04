let trades = [];

export function saveTrade(t) {
  trades.push(t);
}

export function getTrades() {
  return trades;
}
