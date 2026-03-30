import { useState } from "react";
import { parseSignal } from "../lib/parser";
import { useTradingStore } from "../store/tradingStore";
import TimeframeSelector from "./TimeframeSelector";
import ModelSelector from "./ModelSelector";

export default function ChatAI() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const { timeframe, model, setSignal } = useTradingStore();

  const send = async (text = message) => {
    if (!text) return;

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: text, timeframe, model })
      });

      const data = await res.json();
      const reply = data.reply;

      const parsed = parseSignal(reply);
      setSignal(parsed);

      setChat(prev => [
        ...prev,
        { role: "user", text },
        { role: "ai", text: reply }
      ]);

      setMessage("");

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col">
      <ModelSelector />
      <TimeframeSelector />

      <div className="flex-1 overflow-y-auto space-y-2">
        {chat.map((c, i) => (
          <div key={i} className={c.role === "user" ? "text-right" : "text-left"}>
            <div className={`inline-block px-3 py-2 rounded-xl ${c.role === "user" ? "bg-blue-500" : "bg-white/10"}`}>
              {c.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-gray-400">AI analyzing...</div>}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 p-2 rounded-lg bg-white/10 outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tanya market..."
        />
        <button className="px-4 bg-blue-500 rounded-lg" onClick={() => send()}>
          Kirim
        </button>
      </div>
    </div>
  );
}
