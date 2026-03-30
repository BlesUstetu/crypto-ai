export function parseSignal(text) {
  return {
    type: text.includes("BUY") ? "BUY" :
          text.includes("SELL") ? "SELL" : "WAIT",
    entry: "-",
    tp: "-",
    sl: "-",
    confidence: "0%"
  };
}
