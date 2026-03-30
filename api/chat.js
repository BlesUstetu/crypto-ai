import { getMarketData } from "../lib/market.js";
import { askAI } from "../lib/openrouter.js";

export default async function handler(req, res) {
  try {
    // =========================
    // SAFE BODY PARSE
    // =========================
    let body = req.body;

    if (!body) {
      body = await new Promise((resolve) => {
        let data = "";
        req.on("data", (chunk) => (data += chunk));
        req.on("end", () => resolve(JSON.parse(data || "{}")));
      });
    }

    const {
      message = "",
      timeframe = "SCALP",
      model = "openai/gpt-4o-mini"
    } = body;

    // =========================
    // VALIDATION
    // =========================
    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    // =========================
    // MARKET SAFE FETCH
    // =========================
    let market = {
      exchanges: {},
      avg: 0,
      spread: 0,
    };

    try {
      market = await getMarketData();
    } catch (err) {
      console.error("MARKET FAIL:", err.message);
    }

    // =========================
    // PROMPT ENGINEERING
    // =========================
    const prompt = `
Kamu adalah AI trading profesional.

Mode: ${timeframe}

Aturan:
- SCALP → cepat, TP kecil, SL ketat
- SWING → TP lebih jauh, SL longgar

Market:
Binance: ${market.exchanges?.binance || "-"}
Coinbase: ${market.exchanges?.coinbase || "-"}
Bybit: ${market.exchanges?.bybit || "-"}
Avg: ${market.avg || "-"}
Spread: ${market.spread || "-"}

User: ${message}

Format wajib:
Signal: BUY / SELL / HOLD
Entry:
TP:
SL:
Confidence:
Reason:
`;

    // =========================
    // AI CALL (SAFE)
    // =========================
    let reply = "AI tidak merespon";

    try {
      reply = await askAI({ prompt, model });
    } catch (err) {
      console.error("AI ERROR:", err.message);

      reply = `
Signal: HOLD
Entry: -
TP: -
SL: -
Confidence: LOW
Reason: AI service error
`;
    }

    // =========================
    // RESPONSE
    // =========================
    return res.status(200).json({
      success: true,
      reply,
      market,
    });

  } catch (e) {
    console.error("FATAL ERROR:", e);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
