import { getMarket } from "./aggregate.js";
import { getNews } from "./news.js";
import { runAI } from "./ai.js";
import { saveTrade } from "./db.js";

export async function GET() {
  try {
    const market = await getMarket();
    const news = await getNews();

    const input = { ...market, news };

    const ai = await runAI(input);

    const signal = ai[0]?.signal || "NO TRADE";
    const confidence = ai[0]?.confidence || 0;

    // simpan trade
    saveTrade({
      time: Date.now(),
      signal,
      confidence,
      price: market.price
    });

    return Response.json({
      signal,
      confidence,
      detail: ai,
      market
    });

  } catch (e) {
    return Response.json({
      error: true,
      message: e.message
    }, { status: 500 });
  }
}
