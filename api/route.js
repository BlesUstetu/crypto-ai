import { getTrades } from "../db/route.js";

export async function GET() {
  const trades = await getTrades();

  const win = trades.filter(t => t.outcome === "WIN").length;
  const loss = trades.filter(t => t.outcome === "LOSS").length;

  const total = trades.length || 1;

  return Response.json({
    total,
    win,
    loss,
    winrate: win / total
  });
}