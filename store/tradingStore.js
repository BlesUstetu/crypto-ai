import { create } from "zustand";

export const useTradingStore = create(set => ({
  timeframe: "SCALP",
  model: "Claude",

  signal: {
    type: "WAIT",
    entry: "-",
    tp: "-",
    sl: "-",
    confidence: "0%"
  },

  setTimeframe: (t) => set({ timeframe: t }),
  setModel: (m) => set({ model: m }),
  setSignal: (s) => set({ signal: s })
}));
