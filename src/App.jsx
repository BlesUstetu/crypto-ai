import { useState, useEffect, useRef } from "react";

/* ================= LOADER ================= */
function NeuralUltraLite({ signal = "WAIT" }) {
  const color =
    signal === "BUY"
      ? "#22c55e"
      : signal === "SELL"
      ? "#ef4444"
      : "#3b82f6";

  return (
    <div style={styles.loaderContainer}>
      <svg width="200" height="120">
        {[20, 100].map((y, i) => (
          <line
            key={i}
            x1="20"
            y1="60"
            x2="100"
            y2={y}
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="6 6"
            style={i === 0 ? styles.flow : styles.flowSlow}
          />
        ))}
        {[20, 100].map((y, i) => (
          <line
            key={i + 10}
            x1="100"
            y1={y}
            x2="180"
            y2="60"
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="6 6"
            style={i === 0 ? styles.flow : styles.flowSlow}
          />
        ))}

        {[
          { x: 20, y: 60 },
          { x: 100, y: 20 },
          { x: 100, y: 100 },
          { x: 180, y: 60 },
          { x: 60, y: 60 },
          { x: 140, y: 60 },
        ].map((n, i) => (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r="5"
            fill={color}
            style={{
              animation: "pulse 1.4s infinite",
              animationDelay: `${i * 0.2}s`,
              filter: `drop-shadow(0 0 6px ${color})`,
            }}
          />
        ))}
      </svg>
      <div style={styles.loaderText}>AI processing...</div>
    </div>
  );
}

/* ================= APP ================= */
export default function App() {
  const [mode, setMode] = useState("SCALP");
  const [model, setModel] = useState("Claude");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [signal, setSignal] = useState({
    type: "WAIT",
    entry: "-",
    tp: "-",
    sl: "-",
    confidence: 0,
  });

  const chatRef = useRef(null);

  /* inject animation sekali */
  useEffect(() => {
    if (!document.getElementById("neon-style")) {
      const style = document.createElement("style");
      style.id = "neon-style";
      style.innerHTML = `
        @keyframes flow {
          0% { stroke-dashoffset: 50; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }
        @keyframes neonMove {
          0% { background-position: 0% }
          100% { background-position: 200% }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  /* auto scroll */
  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input) return;

    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, model, mode }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error);

      setMessages((prev) => [
        ...prev,
        { role: "ai", text: data.text || "No response" },
      ]);

      if (data.signal) setSignal(data.signal);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Error: " + err.message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const neonColor =
    signal.type === "BUY"
      ? "#22c55e"
      : signal.type === "SELL"
      ? "#ef4444"
      : "#3b82f6";

  return (
    <div style={styles.app}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.title}>BTCUSDT</div>
        <div style={styles.subtitle}>AI Trading Terminal</div>
      </div>

      {/* SIGNAL (NEON) */}
      <div
        style={{
          ...styles.signal,
          backgroundImage: `
            linear-gradient(#0f172a, #0f172a),
            linear-gradient(90deg, ${neonColor}, #3b82f6, ${neonColor})
          `,
        }}
      >
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

      {/* PANEL */}
      <div style={styles.panel}>
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

        <div style={styles.chatArea} ref={chatRef}>
          {messages.map((msg, i) => (
            <div key={i} style={{ textAlign: msg.role === "user" ? "right" : "left", marginBottom: 6 }}>
              <span style={{
                background: msg.role === "user" ? "#3b82f6" : "#1f2937",
                padding: "6px 10px",
                borderRadius: 8
              }}>
                {msg.text}
              </span>
            </div>
          ))}

          {loading && <NeuralUltraLite signal={signal.type} />}
        </div>

        <div style={styles.inputBox}>
          <input
            placeholder="Tanya market..."
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button style={styles.send} onClick={sendMessage}>→</button>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLE ================= */
const styles = {
  app: {
    background: "linear-gradient(135deg,#020617,#0a0f1c)",
    minHeight: "100vh",
    padding: 16,
    color: "white",
    fontFamily: "Arial",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
    background: "#0f172a",
    border: "1px solid #1f2937",
  },

  title: { fontWeight: "bold" },
  subtitle: { color: "#888" },

  signal: {
    marginBottom: 12,
    display: "flex",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 14,
    border: "1px solid transparent",
    backgroundOrigin: "border-box",
    backgroundClip: "padding-box, border-box",
    backgroundSize: "100% 100%, 200% 200%",
    animation: "neonMove 4s linear infinite",
  },

  panel: {
    background: "#0f172a",
    borderRadius: 14,
    padding: 14,
    border: "1px solid #1f2937",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    minHeight: 320,
  },

  row: { display: "flex", gap: 8 },

  button: {
    padding: "6px 12px",
    borderRadius: 8,
    border: "none",
    color: "white",
    cursor: "pointer",
  },

  chatArea: {
    flex: 1,
    background: "#020617",
    borderRadius: 10,
    padding: 10,
    overflowY: "auto",
  },

  inputBox: { display: "flex", gap: 8 },

  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "none",
    background: "#1f2937",
    color: "white",
  },

  send: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "none",
    background: "#3b82f6",
    color: "white",
    cursor: "pointer",
  },

  signalRight: { display: "flex", flexDirection: "column" },
  label: { color: "#888", fontSize: 12 },
  signalText: { fontSize: 28, fontWeight: "bold" },

  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 10,
  },

  loaderText: {
    marginTop: 6,
    fontSize: 12,
    color: "#888",
  },

  flow: { animation: "flow 2s linear infinite" },
  flowSlow: { animation: "flow 3s linear infinite" },
};
