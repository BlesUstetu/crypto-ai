import { useStore } from "../store/useStore";

export default function Heatmap() {
  const { orderbook } = useStore();
  if (!orderbook) return <div>Loading...</div>;

  const max = Math.max(
    ...orderbook.bids.map(b=>b.size),
    ...orderbook.asks.map(a=>a.size)
  );

  return (
    <div>
      <h3>Heatmap</h3>
      {orderbook.asks.slice(0,10).map((a,i)=>(
        <div key={i} style={{background:`rgba(255,0,0,${a.size/max})`}}>
          {a.price} | {a.size}
        </div>
      ))}
      {orderbook.bids.slice(0,10).map((b,i)=>(
        <div key={i} style={{background:`rgba(0,255,0,${b.size/max})`}}>
          {b.price} | {b.size}
        </div>
      ))}
    </div>
  );
}
