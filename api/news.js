export default async function handler(req, res) {
  res.json({
    sentiment: "bullish",
    score: 0.6,
    headline: "Crypto market strong"
  });
}
