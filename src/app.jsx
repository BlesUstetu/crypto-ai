import Navbar from "./components/Navbar"
import TradingChart from "./components/TradingChart"
import OrderForm from "./components/OrderForm"
import ChatAI from "./components/ChatAI"
import PositionPanel from "./components/PositionPanel"

export default function App() {
  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <Navbar />

      <div className="flex flex-1">
        <div className="flex-1">
          <TradingChart />
        </div>

        <div className="w-[350px] border-l border-gray-800 flex flex-col">
          <OrderForm />
          <PositionPanel />
          <ChatAI />
        </div>
      </div>
    </div>
  )
}
