import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('shopsimulator_token') || null,
  user: JSON.parse(localStorage.getItem('shopsimulator_user') || 'null'),

  setAuth: (token, user) => {
    localStorage.setItem('shopsimulator_token', token)
    localStorage.setItem('shopsimulator_user', JSON.stringify(user))
    set({ token, user })
  },

  logout: () => {
    localStorage.removeItem('shopsimulator_token')
    localStorage.removeItem('shopsimulator_user')
    set({ token: null, user: null })
  },
}))
