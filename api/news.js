export async function getNews() {
  return {
    sentiment: "bullish",
    score: 0.6,
    headline: "Market showing strength"
  };
}

export async function GET() {
  return Response.json(await getNews());
}
