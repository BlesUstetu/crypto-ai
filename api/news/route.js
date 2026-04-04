export async function getNews() {
  return {
    sentiment: "bullish",
    score: 0.6,
    headline: "Crypto strong momentum"
  };
}

export async function GET() {
  return Response.json(await getNews());
}
