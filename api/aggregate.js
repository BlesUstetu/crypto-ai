export default async function handler(req, res) {
  const data = {
    price: 65000,
    buy: 1200,
    sell: 800,
    bid: 5000,
    ask: 3000
  };

  const delta = data.buy - data.sell;
  const imbalance = data.bid / data.ask;

  res.json({ ...data, delta, imbalance });
}
