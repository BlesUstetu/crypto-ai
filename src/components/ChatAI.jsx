import { useState } from 'react'
import { parseSignal } from '../lib/parser'
import { useTradingStore } from '../store/tradingStore'

export default function ChatAI() {
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState([])

  const addOrder = useTradingStore((s) => s.addOrder)

  const sendMessage = () => {
    if (!message) return

    const parsed = parseSignal(message)

    if (parsed) {
      addOrder(parsed)
    }

    setChat([...chat, { text: message }])
    setMessage('')
  }

  return (
    <div>
      <div className="input-group">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter signal..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div className="chat">
        {chat.map((c, i) => (
          <div key={i} className="chat-item">
            {c.text}
          </div>
        ))}
      </div>
    </div>
  )
}
