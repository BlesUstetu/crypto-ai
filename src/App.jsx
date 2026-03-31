import { useState } from "react";

export default function App() {
  const [mode, setMode] = useState("SCALP");
  const [model, setModel] = useState("Claude");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [signal, setSignal] = useState({
    type: "WAIT",
    entry: "-",
    tp: "-",
    sl: "-",
    confidence: 0,
  });

  const sendMessage = async () => {
    if (!input) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          model,
          mode,
        }),
      });

      const data = await res.json();

      // tampilkan chat AI
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.text || "No response" },
      ]);

      // update signal jika ada
      if (data.signal) {
        setSignal(data.signal);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Error koneksi ke AI" },
      ]);
    }
  };

  return (
    <div style={styles.app}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.title}>BTCUSDT</div>
        <div style={styles.subtitle}>AI Trading Terminal</div>
      </div>

      {/* MAIN */}
      <div style={styles.panel}>
        {/* MODEL */}
        <div style={styles.row}>
          {["Claude", "GPT", "Mistral"].map((m) => (
            <button
              key={m}
              onClick={() => setModel(m)}
              style={{
                ...styles.button,
                background: model === m ? "#3b82f6" : "#2a2f3a",
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* MODE */}
        <div style={styles.row}>
          {["SCALP", "SWING"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                ...styles.button,
                background: mode === m ? "#3b82f6" : "#2a2f3a",
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* CHAT AREA */}
        <div style={styles.chatArea}>
          {messages.length === 0 ? (
            <span style={{ color: "#666" }}>
              AI response akan muncul di sini...
            </span>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  textAlign: msg.role === "user" ? "right" : "left",
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    background:
                      msg.role === "user" ? "#3b82f6" : "#1f2937",
                    padding: "6px 10px",
                    borderRadius: 8,
                    display: "inline-block",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))
          )}
        </div>

        {/* INPUT */}
        <div style={styles.inputBox}>
          <input
            placeholder="Tanya market..."
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button style={styles.send} onClick={sendMessage}>
            →
          </button>
        </div>
      </div>

      {/* SIGNAL */}
      <div style={styles.signal}>
        <div>
          <div style={styles.label}>Signal</div>
          <div style={styles.signalText}>{signal.type}</div>
        </div>

        <div style={styles.signalRight}>
          <div>Entry: {signal.entry}</div>
          <div>TP: {signal.tp}</div>
          <div>SL: {signal.sl}</div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={styles.label}>Confidence</div>
          <div>{signal.confidence}%</div>
        </div>
      </div>
    </div>
  );
}
