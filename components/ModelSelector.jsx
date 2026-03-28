
import { useTradingStore } from "../store/tradingStore";

const models = [
  { name: "Claude", value: "anthropic/claude-3-haiku" },
  { name: "GPT", value: "openai/gpt-4o-mini" },
  { name: "Mistral", value: "mistralai/mistral-7b-instruct" }
];

export default function ModelSelector() {
  const { model, setModel } = useTradingStore();
  return (
    <div className="flex gap-2 mb-2">
      {models.map(m => (
        <button key={m.value} onClick={()=>setModel(m.value)}
          className={`px-3 py-1 rounded-lg ${model===m.value?"bg-blue-500":"bg-white/10"}`}>
          {m.name}
        </button>
      ))}
    </div>
  );
}
