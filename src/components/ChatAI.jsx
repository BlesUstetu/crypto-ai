import { useState } from "react";
import { parseSignal } from "../lib/parser";

export default function ChatAI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input) return;

    const signal = parseSignal(input);
    const aiResponse = generateAnalysis(signal);

    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
      { role: "ai", content: aiResponse },
    ]);

    setInput("");
  };

  return (
    <>
      <div className="chat">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <div className="bubble">{formatMessage(m.content)}</div>
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Contoh: LONG BTC ENTRY 100000 SL 98000 TP 105000"
        />
        <button className="button" onClick={send}>
          Send
        </button>
      </div>
    </>
  );
}

/* =========================
   AI ANALYSIS (PRO FORMAT)
========================= */
function generateAnalysis(s) {
  if (!s.side) return "❌ Signal tidak valid";

  const entry = s.entry ?? "-";
  const tp = s.tp ?? "-";
  const sl = s.sl ?? "-";

  let rr = null;
  let quality = "NEUTRAL";

  if (s.entry && s.tp && s.sl) {
    rr = (
      Math.abs(s.tp - s.entry) / Math.abs(s.entry - s.sl)
    ).toFixed(2);

    if (rr >= 2) quality = "GOOD";
    else if (rr >= 1) quality = "OK";
    else quality = "BAD";
  }

  return `
📊 SIGNAL: ${s.side}

Entry : ${entry}
TP    : ${tp}
SL    : ${sl}

RR    : ${rr ?? "-"}  (${quality})
`.trim();
}

/* =========================
   FORMATTER (COLOR LOGIC)
========================= */
function formatMessage(text) {
  if (!text.includes("RR")) return text;

  if (text.includes("GOOD")) {
    return <span className="good">{text}</span>;
  }
  if (text.includes("BAD")) {
    return <span className="bad">{text}</span>;
  }
  if (text.includes("OK")) {
    return <span className="neutral">{text}</span>;
  }

  return text;
}
