
import { useTradingStore } from "../store/tradingStore";

export default function SignalPanel() {
  const { signal, entry, tp, sl, confidence } = useTradingStore();

  const color =
    signal === "BUY" ? "text-buy shadow-buy" :
    signal === "SELL" ? "text-sell shadow-sell" :
    "text-gray-400";

  return (
    <div className="flex justify-between items-center h-full">
      <div>
        <div className="text-sm text-gray-400">Signal</div>
        <div className={`text-4xl font-bold ${color}`}>{signal || "WAIT"}</div>
      </div>
      <div className="text-sm space-y-1">
        <div>Entry: {entry || "-"}</div>
        <div>TP: {tp || "-"}</div>
        <div>SL: {sl || "-"}</div>
      </div>
      <div className="text-sm text-gray-400">
        Confidence: {confidence || 0}%
      </div>
    </div>
  );
}
