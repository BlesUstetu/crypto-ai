import ChatAI from "../components/ChatAI";
import MarketData from "../components/MarketData";
import SignalPanel from "../components/SignalPanel";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg text-white p-4 space-y-4">

      {/* HEADER */}
      <div className="glass rounded-2xl p-4 flex justify-between items-center">
        <div className="text-lg font-bold">BTCUSDT</div>
        <div className="text-sm text-gray-400">AI Trading Terminal</div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* MARKET */}
        <div className="glass rounded-2xl p-4">
          <MarketData />
        </div>

        {/* CHAT */}
        <div className="glass rounded-2xl p-4 md:col-span-2">
          <ChatAI />
        </div>
      </div>

      {/* SIGNAL PANEL */}
      <div className="glass rounded-2xl p-4">
        <SignalPanel />
      </div>

    </div>
  );
}
