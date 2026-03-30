import { useEffect, useState } from "react";
import axios from "axios";

export default function MarketData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = () => axios.get("/api/market").then(res=>setData(res.data));
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h3 className="mb-2 font-bold">Market (Live)</h3>
      {Object.entries(data.exchanges).map(([k,v])=>(
        <div key={k} className="flex justify-between">
          <span>{k}</span><span>{v}</span>
        </div>
      ))}
      <div className="mt-2 border-t border-white/10 pt-2">
        <div>AVG: {data.avg}</div>
        <div>Spread: {data.spread}</div>
      </div>
    </div>
  );
}
