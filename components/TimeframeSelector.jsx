import { useTradingStore } from "../store/tradingStore";

export default function TimeframeSelector() {
  const { timeframe, setTimeframe } = useTradingStore();

  const list = ["SCALP", "SWING"];

  return (
    <div className="flex gap-2">
      {list.map(t => (
        <button
          key={t}
          onClick={() => setTimeframe(t)}
          className={`px-3 py-1 rounded ${
            timeframe === t ? "bg-blue-500" : "bg-white/10"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
