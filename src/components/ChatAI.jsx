import { useState } from "react";
import { parseInput } from "../lib/parser";

export default function ChatAI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input) return;

    const parsed = parseInput(input);

    let aiResponse;

    if (parsed.type === "signal") {
      aiResponse = generateSignalAnalysis(parsed.data);
    } else {
      aiResponse = generateMarketResponse(parsed.data);
    }

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
   SIGNAL ANALYSIS
========================= */
function generateSignalAnalysis(s) {
  if (!s.side) return "❌ Signal tidak valid";

  const entry = s.entry ?? "-";
  const tp = s.tp ?? "-";
  const sl = s.sl ?? "-";

  let rr = "-";
  let quality = "NEUTRAL";

  if (s.entry && s.tp && s.sl && s.entry !== s.sl) {
    const value =
      Math.abs(s.tp - s.entry) / Math.abs(s.entry - s.sl);

    if (isFinite(value)) {
      rr = value.toFixed(2);

      if (value >= 2) quality = "GOOD";
      else if (value >= 1) quality = "OK";
      else quality = "BAD";
    }
  }

  return {
    type: "signal",
    side: s.side,
    entry,
    tp,
    sl,
    rr,
    quality,
  };
}

/* =========================
   MARKET ANALYSIS (SIMPLE AI)
========================= */
function generateMarketResponse(text) {
  const lower = text.toLowerCase();

  if (lower.includes("btc") || lower.includes("bitcoin")) {
    return {
      type: "analysis",
      text: "📊 BTC: Market cenderung sideways. Tunggu breakout atau konfirmasi trend.",
    };
  }

  return {
    type: "analysis",
    text: "📊 Market: Belum ada signal jelas. Hindari entry tanpa konfirmasi.",
  };
}

/* =========================
   RENDER FORMAT
========================= */
function formatMessage(data) {
  if (typeof data === "string") return data;

  if (data.type === "analysis") {
    return data.text;
  }

  return (
    <div style={{ whiteSpace: "pre-line" }}>
      <div>📊 SIGNAL: {data.side}</div>

      <br />

      <div>Entry : {data.entry}</div>
      <div>TP    : {data.tp}</div>
      <div>SL    : {data.sl}</div>

      <br />

      <div className={getClass(data.quality)}>
        RR : {data.rr} ({data.quality})
      </div>
    </div>
  );
}

function getClass(q) {
  if (q === "GOOD") return "good";
  if (q === "BAD") return "bad";
  return "neutral";
}
