const CACHE = new Map();
const TTL = 10000;

const MODELS = [
  "openai/gpt-4o-mini",
  "anthropic/claude-3-haiku",
  "deepseek/deepseek-chat",
  "mistralai/mixtral-8x7b-instruct",
  "qwen/qwen2.5-7b-instruct",
];

export default async function handler(req, res) {
  try {
    const symbol = "BTCUSDT"; // pakai fix dulu biar stabil

    const cached = CACHE.get(symbol);
    if (cached && Date.now() - cached.time < TTL) {
      return res.json({ ...cached.data, cached: true });
    }

    const market = await fetchMarket(symbol);
    const news = await fetchNews("BTC");

    console.log("PRICE:", market.price);

    const summary = buildSummary(symbol, market, news);

    const aiResults = await runAI(summary);
    const decision = getDecision(aiResults, news);

    const price = market.price || 0;

    // 🔥 RESULT FINAL (MATCH FRONTEND)
    const result = {
      text: `Signal ${decision.final} | Score ${decision.score.toFixed(2)}`,

      signal: {
        type: decision.final === "SHORT" ? "SELL" : decision.final,

        entry: price > 0 ? price : "-",

        tp:
          price > 0
            ? decision.final === "BUY"
              ? (price * 1.01).toFixed(2)
              : decision.final === "SHORT"
              ? (price * 0.99).toFixed(2)
              : "-"
            : "-",

        sl:
          price > 0
            ? decision.final === "BUY"
              ? (price * 0.99).toFixed(2)
              : decision.final === "SHORT"
              ? (price * 1.01).toFixed(2)
              : "-"
            : "-",

        confidence: Math.round(decision.confidence),
      },

      aiResults,
      decision,
      symbol,
    };

    CACHE.set(symbol, { data: result, time: Date.now() });

    res.json(result);
  } catch (e) {
    res.status(500).json({
      text: "ERROR API",
      signal: {
        type: "WAIT",
        entry: "-",
        tp: "-",
        sl: "-",
        confidence: 0,
      },
      error: e.message,
    });
  }
}

// ================= MARKET =================
async function fetchMarket(symbol) {
  try {
    const r = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
    );

    if (!r.ok) throw new Error();

    const d = await r.json();

    return {
      price: Number(d.price),
      change: 0,
      volume: 0,
    };
  } catch {
    console.log("MARKET FETCH FAILED");

    // fallback supaya tidak 0
    return {
      price: 65000,
      change: 0,
      volume: 0,
    };
  }
}

// ================= NEWS =================
async function fetchNews(symbol) {
  try {
    const r = await fetch(
      `https://cryptopanic.com/api/v1/posts/?auth_token=demo&currencies=${symbol}`
    );

    const d = await r.json();

    return d.results.slice(0, 5).map((n) => ({
      sentiment:
        n.votes?.positive > n.votes?.negative ? "positive" : "negative",
    }));
  } catch {
    return [];
  }
}

// ================= SUMMARY =================
function buildSummary(symbol, m, news) {
  const pos = news.filter((n) => n.sentiment === "positive").length;
  const neg = news.filter((n) => n.sentiment === "negative").length;

  return `Symbol:${symbol}
Price:${m.price}
Change:${m.change}%
Volume:${m.volume}
Positive:${pos}
Negative:${neg}
Answer BUY SELL or HOLD`;
}

// ================= AI =================
async function runAI(summary) {
  const key = process.env.OPENROUTER_API_KEY;

  // fallback kalau tidak ada API key
  if (!key) {
    console.log("NO OPENROUTER API KEY");
    return MODELS.map(() => "HOLD");
  }

  const results = await Promise.allSettled(
    MODELS.map(async (model) => {
      try {
        const r = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: "Answer BUY SELL or HOLD" },
                { role: "user", content: summary },
              ],
              temperature: 0,
            }),
          }
        );

        if (!r.ok) return "HOLD";

        const d = await r.json();
        const t =
          d?.choices?.[0]?.message?.content?.toUpperCase() || "";

        if (t.includes("BUY")) return "BUY";
        if (t.includes("SELL")) return "SHORT";

        return "HOLD";
      } catch {
        return "HOLD";
      }
    })
  );

  return results.map((r) =>
    r.status === "fulfilled" ? r.value : "HOLD"
  );
}

// ================= DECISION =================
function getDecision(ai, news) {
  let score = 0;

  ai.forEach((r) => {
    if (r === "BUY") score += 1;
    if (r === "SHORT") score -= 1;
  });

  const pos = news.filter((n) => n.sentiment === "positive").length;
  const neg = news.filter((n) => n.sentiment === "negative").length;

  score += (pos - neg) * 0.1;

  let final = "HOLD";
  if (score > 1) final = "BUY";
  if (score < -1) final = "SHORT";

  return {
    final,
    confidence: Math.min(100, Math.abs(score) * 20),
    score,
  };
}
