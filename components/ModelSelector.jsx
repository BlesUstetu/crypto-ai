import { useTradingStore } from "../store/tradingStore";

export default function ModelSelector() {
  const { model, setModel } = useTradingStore();

  const list = ["Claude", "GPT", "Mistral"];

  return (
    <div className="flex gap-2">
      {list.map(m => (
        <button
          key={m}
          onClick={() => setModel(m)}
          className={`px-3 py-1 rounded ${
            model === m ? "bg-blue-500" : "bg-white/10"
          }`}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
