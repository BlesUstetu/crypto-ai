import { create } from "zustand";

export const useStore = create(set => ({
  market: null,
  orderbook: null,
  signal: null,
  setMarket: m => set({ market: m }),
  setOrderbook: ob => set({ orderbook: ob }),
  setSignal: s => set({ signal: s })
}));
