import ChatAI from "../components/ChatAI";
import SignalPanel from "../components/SignalPanel";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg text-white p-4 space-y-4">

      <div className="glass rounded-2xl p-4 flex justify-between">
        <div className="font-bold">BTCUSDT</div>
        <div className="text-gray-400">AI Trading Terminal</div>
      </div>

      <div className="glass rounded-2xl p-4">
        <ChatAI />
      </div>

      <div className="glass rounded-2xl p-4">
        <SignalPanel />
      </div>

    </div>
  );
}
