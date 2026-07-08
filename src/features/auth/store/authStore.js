import { create } from 'zustand'
import { authService } from '../services/authService'
import axiosClient from '../../../shared/api/axiosClient'

export const useAuthStore = create((set, get) => ({
  currentUser: null,
  childProfile: null,
  profileStats: null,
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
      // Fetch child profile automatically after successful login
      await get().loadChildProfile()
      return user
    } catch (error) {
      set({
        currentUser: null,
        childProfile: null,
        profileStats: null,
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
      const user = await authService.signup({ nickname: username, email, password })
      set({
        currentUser: user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
      // Fetch child profile automatically after successful signup
      await get().loadChildProfile()
      return user
    } catch (error) {
      set({
        currentUser: null,
        childProfile: null,
        profileStats: null,
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
      // Load child profile details
      await get().loadChildProfile()
      return user
    } catch (error) {
      set({
        currentUser: null,
        childProfile: null,
        profileStats: null,
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
        childProfile: null,
        profileStats: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
    }
  },

  loadChildProfile: async () => {
    try {
      const response = await axiosClient.get('/profile/child')
      const profile = response.data.data
      set({ childProfile: profile })
      if (profile?.id) {
        await get().loadProfileStats(profile.id)
      }
      return profile
    } catch (error) {
      console.error('Failed to load child profile:', error)
      return null
    }
  },

  loadProfileStats: async (childId) => {
    try {
      // 1. Fetch vocabulary count
      const vocabRes = await axiosClient.get(`/progress/vocabularies?childId=${childId}`)
      const vocabularyCount = vocabRes.data.data?.length || 0

      // 2. Fetch achievement count
      const achievementRes = await axiosClient.get(`/child-achievements?childId=${childId}`)
      const achievementCount = achievementRes.data.data?.filter(a => a.earnedAt != null).length || 0

      // 3. Fetch buddy level
      const buddyRes = await axiosClient.get('/buddy/profiles')
      const myBuddy = buddyRes.data.data?.find(b => b.childId === childId)
      const buddyLevel = myBuddy ? myBuddy.level : 1

      set({
        profileStats: {
          vocabularyCount,
          achievementCount,
          buddyLevel,
        },
      })
    } catch (error) {
      console.error('Failed to load profile stats:', error)
    }
  },
}))

