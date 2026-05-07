import { create } from 'zustand'

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  clear: () => set({ products: [], loading: false, error: null }),
}))
