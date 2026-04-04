import { getTrades } from "../db/route.js";

export async function GET() {
  const trades = await getTrades();

  const result = trades.map(t => {
    const current = 65000;

    let outcome = "OPEN";

    if (t.signal === "LONG") {
      if (current > t.price * 1.01) outcome = "WIN";
      if (current < t.price * 0.99) outcome = "LOSS";
    }

    if (t.signal === "SHORT") {
      if (current < t.price * 0.99) outcome = "WIN";
      if (current > t.price * 1.01) outcome = "LOSS";
    }

    return { ...t, outcome };
  });

  return Response.json(result);
}
