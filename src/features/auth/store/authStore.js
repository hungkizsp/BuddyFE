import { create } from 'zustand'
import { authService } from '../services/authService'

export const useAuthStore = create((set) => ({
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async ({ email, password }) => {
    set({ isLoading: true, error: null })

    try {
      const user = await authService.login({ email, password })
      set({
        currentUser: user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
      return user
    } catch (error) {
      set({
        currentUser: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.message,
      })
      throw error
    }
  },

  signup: async ({ username, email, password }) => {
    set({ isLoading: true, error: null })

    try {
      const user = await authService.signup({ username, email, password })
      set({
        currentUser: user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
      return user
    } catch (error) {
      set({
        currentUser: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.message,
      })
      throw error
    }
  },

  loadCurrentUser: async () => {
    set({ isLoading: true, error: null })

    try {
      const user = await authService.getCurrentUser()
      set({
        currentUser: user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
      return user
    } catch (error) {
      set({
        currentUser: null,
        isAuthenticated: false,
        isLoading: false,
      })
      return null
    }
  },

  logout: async () => {
    try {
      await authService.logout()
    } finally {
      set({
        currentUser: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
    }
  },
}))
