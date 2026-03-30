
import { create } from "zustand";

export const useTradingStore = create((set) => ({
  signal: null,
  entry: null,
  tp: null,
  sl: null,
  confidence: 0,
  timeframe: "SCALP",
  model: "anthropic/claude-3-haiku",
  setSignal: (data) => set(data),
  setTimeframe: (tf) => set({ timeframe: tf }),
  setModel: (model) => set({ model })
}));
