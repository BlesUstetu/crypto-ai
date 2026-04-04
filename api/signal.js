
import axios from "axios";
import { DEFAULT_PARAMS } from "./params.js";
import { detectStructure, detectSweep, detectOrderBlock, detectFVG, inZone } from "./core.js";

export default async function handler(req,res){
  const symbol = req.query.symbol || "BTCUSDT";

  const [p, ob, k] = await Promise.all([
    axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`),
    axios.get(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=20`),
    axios.get(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=50`)
  ]);

  const price = +p.data.price;
  const bids = ob.data.bids;
  const asks = ob.data.asks;
  const closes = k.data.map(d=>+d[4]);

  const structure = detectStructure(closes);
  const sweep = detectSweep(price, structure.high, structure.low, closes);
  const oblock = detectOrderBlock(k.data);
  const fvg = detectFVG(k.data);

  let score = 0;
  const pms = DEFAULT_PARAMS;

  if(sweep==="SWEEP_LOW") score += pms.W_SWEEP;
  if(sweep==="SWEEP_HIGH") score -= pms.W_SWEEP;

  if(inZone(price, oblock.bullishOB)) score += pms.W_OB;
  if(inZone(price, oblock.bearishOB)) score -= pms.W_OB;

  const nearFVG = fvg.find(z => Math.abs(price-z.low)/price < pms.NEAR_FVG_PCT);
  if(nearFVG?.type==="BULLISH") score += pms.W_FVG;
  if(nearFVG?.type==="BEARISH") score -= pms.W_FVG;

  const action = score>pms.BUY_TH ? "BUY" : score<pms.SELL_TH ? "SELL":"WAIT";

  res.json({
    symbol,
    price,
    action,
    score,
    sweep,
    structure,
    oblock,
    fvg
  });
}
