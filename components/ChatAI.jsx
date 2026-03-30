import { useState, useEffect, useRef } from "react";
import { parseSignal } from "../lib/parser";
import { useTradingStore } from "../store/tradingStore";
import TimeframeSelector from "./TimeframeSelector";
import ModelSelector from "./ModelSelector";

export default function ChatAI() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const endRef = useRef();

  const { timeframe, model, setSignal } = useTradingStore();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const send = async () => {
    if (!message) return;

    setLoading(true);

    try {
      // 🔥 dummy response (aman tanpa backend dulu)
      const reply = `
      SIGNAL: WAIT
      ENTRY: -
      TP: -
      SL: -
      CONFIDENCE: 0%
      `;

      const parsed = parseSignal(reply);
      setSignal(parsed);

      setChat(prev => [
        ...prev,
        { role: "user", text: message },
        { role: "ai", text: reply }
      ]);

      setMessage("");

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[400px]">

      <div className="flex gap-2 mb-2">
        <ModelSelector />
        <TimeframeSelector />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {chat.map((c, i) => (
          <div key={i} className={c.role === "user" ? "text-right" : "text-left"}>
            <div className={`inline-block px-3 py-2 rounded-xl ${
              c.role === "user" ? "bg-blue-500" : "bg-white/10"
            }`}>
              {c.text}
            </div>
          </div>
        ))}

        {loading && <div className="text-gray-400">AI analyzing...</div>}
        <div ref={endRef} />
      </div>

      <div className="flex gap-2 mt-2">
        <input
          className="flex-1 p-2 rounded-lg bg-white/10 outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tanya market..."
        />
        <button onClick={send} className="px-4 bg-blue-500 rounded-lg">
          Kirim
        </button>
      </div>
    </div>
  );
}
