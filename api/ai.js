export async function runAI(input) {
  // versi stabil dulu (anti error parsing)
  return [
    {
      signal: input.delta > 0 ? "LONG" : "SHORT",
      confidence: 70,
      reason: "Based on delta + simple logic"
    }
  ];
}
