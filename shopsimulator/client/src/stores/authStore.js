import { create } from 'zustand'

const TOKEN_KEY = 'shopsimulator_token'
const USER_KEY = 'shopsimulator_user'

const safeGetItem = (key) => {
  try {
    return localStorage.getItem(key)
  } catch {
    console.error(`localStorage.getItem("${key}") failed`)
    return null
  }
}

const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    console.error(`localStorage.setItem("${key}") failed`)
  }
}

const safeRemoveItem = (key) => {
  try {
    localStorage.removeItem(key)
  } catch {
    console.error(`localStorage.removeItem("${key}") failed`)
  }
}

export const useAuthStore = create((set) => ({
  token: safeGetItem(TOKEN_KEY) || null,
  user: JSON.parse(safeGetItem(USER_KEY) || 'null'),

  setAuth: (token, user) => {
    safeSetItem(TOKEN_KEY, token)
    safeSetItem(USER_KEY, JSON.stringify(user))
    set({ token, user })
  },

  logout: () => {
    safeRemoveItem(TOKEN_KEY)
    safeRemoveItem(USER_KEY)
    set({ token: null, user: null })
  },
}))
