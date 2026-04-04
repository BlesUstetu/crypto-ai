import { useStore } from "../store/useStore";
export default function AIChat(){
  const { signal } = useStore();
  return (
    <div>
      <h3>AI Reason</h3>
      {signal?.detail?.map((d,i)=><p key={i}>{d.reason}</p>)}
    </div>
  );
}
