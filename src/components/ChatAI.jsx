import { useState } from "react";
import { parseSignal } from "../lib/parser";

export default function ChatAI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input) return;

    const signal = parseSignal(input);

    const aiResponse = generateAnalysis(signal);

    setMessages(prev => [
      ...prev,
      { role: "user", content: input },
      { role: "ai", content: aiResponse }
    ]);

    setInput("");
  };

  return (
    <div style={{ padding: 10 }}>
      <div style={{ height: 300, overflow: "auto", marginBottom: 10 }}>
        {messages.map((m, i) => (
          <div key={i}>
            <b>{m.role}:</b> {m.content}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e)=>setInput(e.target.value)}
        onKeyDown={(e)=> e.key==="Enter" && send()}
        style={{ width: "80%" }}
      />
      <button onClick={send}>Send</button>
    </div>
  );
}

function generateAnalysis(s) {
  if (!s.side) return "Tidak terdeteksi signal.";

  let rr = null;
  if (s.entry && s.tp && s.sl) {
    rr = ((s.tp - s.entry) / (s.entry - s.sl)).toFixed(2);
  }

  return `
Signal: ${s.side}
Entry: ${s.entry || "-"}
TP: ${s.tp || "-"}
SL: ${s.sl || "-"}
RR: ${rr || "-"}
Rekomendasi: ${rr > 2 ? "Bagus" : "Kurang ideal"}
`;
}
