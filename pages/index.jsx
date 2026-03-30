
import ChatAI from "../components/ChatAI";
import MarketData from "../components/MarketData";
import SignalPanel from "../components/SignalPanel";

export default function Home() {
  return (
    <div className="h-screen bg-bg text-white p-4">
      <div className="glass rounded-2xl p-4 mb-4 flex justify-between items-center">
        <div className="text-lg font-bold">BTCUSDT</div>
        <div className="text-sm text-gray-400">AI Trading Terminal</div>
      </div>

      <div className="grid grid-cols-3 gap-4 h-[70%]">
        <div className="glass rounded-2xl p-4">
          <MarketData />
        </div>
        <div className="glass rounded-2xl p-4 col-span-2">
          <ChatAI />
        </div>
      </div>

      <div className="glass rounded-2xl p-4 mt-4 h-[20%]">
        <SignalPanel />
      </div>
    </div>
  );
}
