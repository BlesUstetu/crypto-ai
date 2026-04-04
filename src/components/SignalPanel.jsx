import { useStore } from "../store/useStore";

export default function SignalPanel() {
  const { market, signal } = useStore();

  return (
    <div>
      <h2>{signal?.signal}</h2>
      <p>Confidence: {signal?.confidence?.toFixed(2)}%</p>

      <h3>Market</h3>
      <p>Price: {market?.price}</p>
      <p>Delta: {market?.delta}</p>
    </div>
  );
}
