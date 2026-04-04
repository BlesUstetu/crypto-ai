import { useEffect } from "react";
import { useStore } from "./store/useStore";
import { startWS } from "./utils/ws";
import { startOrderBook } from "./utils/orderbookWS";
import SignalPanel from "./components/SignalPanel";
import Heatmap from "./components/Heatmap";
import AIChat from "./components/AIChat";

export default function App(){
  const { setMarket, setOrderbook, setSignal } = useStore();

  useEffect(()=>{
    startWS("btcusdt", setMarket);
    startOrderBook("btcusdt", setOrderbook);

    const load = async ()=>{
      const r = await fetch("/api/signal");
      const j = await r.json();
      setSignal(j);
    };

    load();
    const i = setInterval(load,5000);
    return ()=>clearInterval(i);
  },[]);

  return (
    <div style={{padding:20}}>
      <h1>AI Crypto PRO MAX FINAL</h1>
      <SignalPanel/>
      <Heatmap/>
      <AIChat/>
    </div>
  );
}
