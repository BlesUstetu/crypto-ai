export async function getMarket() {
  const price = 65000 + Math.random() * 100;

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
