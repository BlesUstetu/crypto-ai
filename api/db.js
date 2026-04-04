import fs from "fs";
const FILE="./data/trades.json";
export function saveTrade(t){
  let d=[]; if(fs.existsSync(FILE)) d=JSON.parse(fs.readFileSync(FILE));
  d.push(t); fs.writeFileSync(FILE,JSON.stringify(d,null,2));
}
export function getTrades(){
  if(!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE));
}
