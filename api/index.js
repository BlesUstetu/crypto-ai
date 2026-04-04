export default async function handler(req, res) {
  const { url } = req;

  if (url.includes("/api/signal")) {
    return res.json({
      signal: "LONG",
      confidence: 70,
      detail: [{ reason: "API OK" }]
    });
  }

  if (url.includes("/api/aggregate")) {
    return res.json({
      price: 65000,
      delta: 120
    });
  }

  if (url.includes("/api/news")) {
    return res.json({
      sentiment: "bullish"
    });
  }

  res.status(404).json({ error: "Not found" });
}
