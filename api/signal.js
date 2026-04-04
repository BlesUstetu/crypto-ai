import aggregate from "./aggregate.js";
import news from "./news.js";
import { runAI } from "./ai.js";

export default async function handler(req, res) {
  try {
    // 🔥 CALL INTERNAL FUNCTION (BUKAN FETCH)
    const market = await new Promise(resolve =>
      aggregate({}, { json: resolve })
    );

    const sentiment = await new Promise(resolve =>
      news({}, { json: resolve })
    );

    const input = {
      ...market,
      news: sentiment
    };

    const ai = await runAI(input);

    const signal = ai[0]?.signal || "NO TRADE";
    const confidence = ai[0]?.confidence || 0;

    res.json({
      signal,
      confidence,
      detail: ai
    });

  } catch (e) {
    res.status(500).json({
      error: "Signal error",
      message: e.message
    });
  }
}
