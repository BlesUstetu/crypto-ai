export async function getMarket() {
  // versi stabil dulu (bisa inject WS nanti)
  const price = 65000 + Math.random() * 200;

  const buy = Math.random() * 1000;
  const sell = Math.random() * 1000;

  return {
    price,
    buy,
    sell,
    delta: buy - sell,
    imbalance: (buy + 1) / (sell + 1)
  };
}

export async function GET() {
  return Response.json(await getMarket());
}
