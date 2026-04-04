import { runAI } from "./ai.js";
import { saveTrade } from "./db.js";

export default async function handler(req,res){
  const market={price:65000};
  const ai=await runAI(market);

  const signal=ai[0].signal;
  const confidence=ai[0].confidence;

  saveTrade({time:Date.now(),signal,confidence});

  res.json({signal,confidence,detail:ai});
}
