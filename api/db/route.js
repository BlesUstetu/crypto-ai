let trades = [];

export async function saveTrade(t) {
  trades.push(t);
}

export async function getTrades() {
  return trades;
}

export async function GET() {
  return Response.json(await getTrades());
}
