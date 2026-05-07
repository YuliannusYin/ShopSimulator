import { create } from 'zustand'

export const useOrderStore = create((set) => ({
  orders: [],
  loading: false,
  error: null,

  setOrders: (orders) => set({ orders }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  clear: () => set({ orders: [], loading: false, error: null }),
}))
