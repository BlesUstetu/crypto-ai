export async function runAI(input) {
  const { delta, imbalance } = input;

  let signal = "NO TRADE";

  if (delta > 0 && imbalance > 1) signal = "LONG";
  if (delta < 0 && imbalance < 1) signal = "SHORT";

  return [
    {
      signal,
      confidence: Math.floor(Math.random() * 20 + 70),
      reason: `Delta ${delta.toFixed(2)} | Imbalance ${imbalance.toFixed(2)}`
    }
  ];
}

export async function GET() {
  return Response.json({ status: "AI READY" });
}
