export default async function handler(req, res) {
  try {
    const url = "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT";

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Binance response not OK");
    }

    const data = await response.json();

    res.status(200).json({
      price: data.price
    });

  } catch (err) {
    console.error("MARKET ERROR:", err.message);

    res.status(200).json({
      price: null,
      error: "Binance API error"
    });
  }
}
