import { create } from 'zustand'

export const useTradingStore = create((set) => ({
  orders: [],

  addOrder: (order) =>
    set((state) => ({
      orders: [...state.orders, order],
    })),
}))
