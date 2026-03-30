
export function parseSignal(text) {
  const get = (key) => {
    const match = text.match(new RegExp(`${key}:\\s*(.*)`));
    return match ? match[1].trim() : null;
  };

  return {
    signal: get("Signal"),
    entry: get("Entry"),
    tp: get("TP"),
    sl: get("SL"),
    confidence: parseInt(get("Confidence")) || 0
  };
}
