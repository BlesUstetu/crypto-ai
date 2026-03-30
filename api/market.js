
import { getMarketData } from "../lib/market.js";

export default async function handler(req, res) {
  try {
    const data = await getMarketData();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
