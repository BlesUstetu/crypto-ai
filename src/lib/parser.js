export function parseInput(text) {
  const upper = text.toUpperCase();

  const isSignal =
    upper.includes("LONG") ||
    upper.includes("SHORT") ||
    upper.includes("ENTRY");

  if (isSignal) {
    return {
      type: "signal",
      data: parseSignal(text),
    };
  }

  return {
    type: "analysis",
    data: text,
  };
}

/* ===== SIGNAL PARSER ===== */
function parseSignal(text) {
  const upper = text.toUpperCase();

  return {
    side: upper.includes("LONG")
      ? "LONG"
      : upper.includes("SHORT")
      ? "SHORT"
      : null,
    entry: extractNumber(text, "ENTRY"),
    sl: extractNumber(text, "SL"),
    tp: extractNumber(text, "TP"),
  };
}

function extractNumber(text, key) {
  const regex = new RegExp(key + "[^0-9]*([0-9]+)", "i");
  const match = text.match(regex);
  return match ? Number(match[1]) : null;
}
