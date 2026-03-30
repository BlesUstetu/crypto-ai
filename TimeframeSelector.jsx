
import { useTradingStore } from "../store/tradingStore";

export default function TimeframeSelector() {
  const { timeframe, setTimeframe } = useTradingStore();
  return (
    <div className="flex gap-2 mb-2">
      {["SCALP","SWING"].map(tf => (
        <button key={tf} onClick={()=>setTimeframe(tf)}
          className={`px-3 py-1 rounded-lg ${timeframe===tf?"bg-blue-500":"bg-white/10"}`}>
          {tf}
        </button>
      ))}
    </div>
  );
}
