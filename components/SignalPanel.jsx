import { useTradingStore } from "../store/tradingStore";

export default function SignalPanel() {
  const { signal } = useTradingStore();

  return (
    <div>
      <div className="text-gray-400 text-sm">Signal</div>

      <div className="text-2xl font-bold">{signal.type}</div>

      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
        <div>Entry: {signal.entry}</div>
        <div>TP: {signal.tp}</div>
        <div>SL: {signal.sl}</div>
        <div>Confidence: {signal.confidence}</div>
      </div>
    </div>
  );
}
