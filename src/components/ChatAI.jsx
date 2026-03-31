import { useState } from "react";

export default function ChatAI(){
  const [input,setInput]=useState("");
  const [output,setOutput]=useState("");
  const [loading,setLoading]=useState(false);

  const send = async ()=>{
    if(!input) return;

    setLoading(true);
    try{
      const symbol = detectSymbol(input);
      const r = await fetch(`/api/analyze?symbol=${symbol}`);
      const d = await r.json();
      setOutput(format(d));
    }catch{
      setOutput("Error");
    }
    setLoading(false);
  };

  return (
    <div style={{padding:20}}>
      <input value={input} onChange={e=>setInput(e.target.value)} placeholder="btc / eth / sol" />
      <button onClick={send}>{loading?"...":"Run"}</button>
      <pre>{output}</pre>
    </div>
  )
}

function detectSymbol(t){
  t=t.toLowerCase();
  if(t.includes("eth")) return "ETHUSDT";
  if(t.includes("sol")) return "SOLUSDT";
  return "BTCUSDT";
}

function format(d){
  return `
${d.symbol}

AI:
${d.aiResults.join("\n")}

FINAL: ${d.decision.final}
CONFIDENCE: ${d.decision.confidence}%
`;
}
