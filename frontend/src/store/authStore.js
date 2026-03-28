import { create } from 'zustand'

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,

  setUser: (user) => set({ user }),
  
  setToken: (token) => {
    localStorage.setItem('token', token)
    set({ token })
  },
  
  clearAuth: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },
  
  setLoading: (isLoading) => set({ isLoading }),
  
  isAuthenticated: () => {
    const { token, user } = get()
    return !!(token && user)
  }
}))
