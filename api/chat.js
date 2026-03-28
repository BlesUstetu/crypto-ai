import { getMarketData } from "../lib/market.js";
import { askAI } from "../lib/openrouter.js";

export default async function handler(req, res) {
  try {
    const { message, timeframe, model } = req.body;

    const market = await getMarketData();

    const prompt = `
Kamu adalah AI trading profesional.

Mode: ${timeframe}

Aturan:
- SCALP → cepat, TP kecil, SL ketat
- SWING → TP lebih jauh, SL longgar

Market:
Binance: ${market.exchanges.binance}
Coinbase: ${market.exchanges.coinbase}
Bybit: ${market.exchanges.bybit}
Avg: ${market.avg}
Spread: ${market.spread}

User: ${message}

Format wajib:
Signal: BUY / SELL / HOLD
Entry:
TP:
SL:
Confidence:
Reason:
`;

    const reply = await askAI({ prompt, model });
    res.status(200).json({ reply, market });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
