import { useState } from "react"

export default function ChatAI() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")

  const sendMessage = async () => {
    if (!input) return

    const newMsg = { role: "user", content: input }
    setMessages((prev) => [...prev, newMsg])
    setInput("")

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Analisa: BTC bullish 🚀" },
      ])
    }, 500)
  }

  return (
    <div className="p-3 border-t border-gray-800">
      <div className="h-40 overflow-y-auto text-sm mb-2">
        {messages.map((m, i) => (
          <div key={i}>
            <b>{m.role}:</b> {m.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 bg-gray-900 p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}
