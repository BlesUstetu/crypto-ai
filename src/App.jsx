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
      </svg>
      <div style={styles.loaderText}>AI processing...</div>
    </div>
  );
}

/* ================= APP ================= */
export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const [signal, setSignal] = useState({
    type: "WAIT",
    entry: "-",
    tp: "-",
    sl: "-",
    confidence: 0,
  });

  const chatRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  /* ===== INIT STYLE ===== */
  useEffect(() => {
    if (!document.getElementById("neon-style")) {
      const style = document.createElement("style");
      style.id = "neon-style";
      style.innerHTML = `
        @keyframes flow {
          0% { stroke-dashoffset: 50; }
          100% { stroke-dashoffset: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  /* ===== AUTO SCROLL ===== */
  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages, loading]);

  /* ===== SPEECH SETUP ===== */
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
      autoResize(textareaRef.current);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;

    return () => {
      recognition.stop(); // 🔥 cleanup fix
    };
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  /* ===== AUTO RESIZE (FIXED) ===== */
  const autoResize = (el) => {
    if (!el) return;
    el.style.height = "0px";
    el.style.height = el.scrollHeight + "px";
  };

  /* ===== SEND ===== */
  const sendMessage = async () => {
    if (!input || loading) return;

    // stop mic saat kirim
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }

    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    setLoading(true);

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "API error");

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
      <div style={styles.header}>
        <div>BTCUSDT</div>
        <div style={{ color: "#888" }}>AI Trading Terminal</div>
      </div>

      <div
        style={{
          ...styles.signal,
          border: `1px solid ${neonColor}`,
        }}
      >
        <div>
          <div>Signal</div>
          <div style={{ fontSize: 24 }}>{signal.type}</div>
        </div>
        <div>
          Entry: {signal.entry} <br />
          TP: {signal.tp} <br />
          SL: {signal.sl}
        </div>
      </div>

      <div style={styles.panel}>
        <div style={styles.chatArea} ref={chatRef}>
          {messages.map((msg, i) => (
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
                }}
              >
                {msg.text}
              </span>
            </div>
          ))}
          {loading && <NeuralUltraLite signal={signal.type} />}
        </div>

        <div style={styles.inputBox}>
          <textarea
            ref={textareaRef}
            value={input}
            rows={1}
            placeholder="Tanya market..."
            style={styles.textarea}
            onChange={(e) => {
              setInput(e.target.value);
              autoResize(e.target);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          {speechSupported && (
            <button
              onClick={toggleMic}
              style={{
                ...styles.mic,
                background: listening ? "#ef4444" : "#1f2937",
              }}
            >
              🎤
            </button>
          )}

          <button
            onClick={sendMessage}
            style={styles.send}
            disabled={loading}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLE ================= */
const styles = {
  app: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#020617",
    padding: 16,
    color: "white",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  signal: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  panel: {
    flex: 1,
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },

  chatArea: {
    flex: 1,
    overflowY: "auto",
    paddingBottom: 120,
  },

  inputBox: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    display: "flex",
    gap: 8,
    background: "#0f172a",
    padding: 10,
    borderRadius: 10,
  },

  textarea: {
    flex: 1,
    resize: "none",
    border: "none",
    borderRadius: 8,
    padding: 10,
    background: "#1f2937",
    color: "white",
    outline: "none",
    overflow: "hidden",
  },

  send: {
    padding: "10px 14px",
    background: "#3b82f6",
    border: "none",
    borderRadius: 8,
    color: "white",
    cursor: "pointer",
  },

  mic: {
    padding: "10px 12px",
    border: "none",
    borderRadius: 8,
    color: "white",
    cursor: "pointer",
  },

  loaderContainer: {
    textAlign: "center",
    marginTop: 10,
  },

  loaderText: {
    fontSize: 12,
    color: "#888",
  },

  flow: { animation: "flow 2s linear infinite" },
  flowSlow: { animation: "flow 3s linear infinite" },
};
