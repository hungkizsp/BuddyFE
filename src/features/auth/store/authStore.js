import { create } from 'zustand'
import { authService } from '../services/authService'
import axiosClient from '../../../shared/api/axiosClient'

let childProfilePromise = null
let profileStatsPromise = null

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
      childProfilePromise = null
      profileStatsPromise = null
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

  loadChildProfile: async (force = false) => {
    if (childProfilePromise && !force) {
      return childProfilePromise
    }

    childProfilePromise = (async () => {
      try {
        const response = await axiosClient.get('/profile/child')
        const profile = response.data.data
        set({ childProfile: profile })
        if (profile?.id) {
          await get().loadProfileStats(profile.id, force)
        }
        return profile
      } catch (error) {
        console.error('Failed to load child profile:', error)
        return null
      } finally {
        childProfilePromise = null
      }
    })()

    return childProfilePromise
  },

  loadProfileStats: async (childId, force = false) => {
    if (!childId) return
    if (profileStatsPromise && !force) {
      return profileStatsPromise
    }

    profileStatsPromise = (async () => {
      try {
        // Fetch vocabulary, achievements, and buddy profiles concurrently in parallel
        const [vocabRes, achievementRes, buddyRes] = await Promise.all([
          axiosClient.get(`/progress/vocabularies?childId=${childId}`),
          axiosClient.get(`/child-achievements?childId=${childId}`),
          axiosClient.get('/buddy/profiles'),
        ])

        const vocabularyCount = vocabRes.data.data?.length || 0
        const achievementCount =
          achievementRes.data.data?.filter((a) => a.earnedAt != null).length || 0
        const myBuddy = buddyRes.data.data?.find((b) => b.childId === childId)
        const buddyLevel = myBuddy ? myBuddy.level : 1

        const stats = {
          vocabularyCount,
          achievementCount,
          buddyLevel,
        }

        set({ profileStats: stats })
        return stats
      } catch (error) {
        console.error('Failed to load profile stats:', error)
        return null
      } finally {
        profileStatsPromise = null
      }
    })()

    return profileStatsPromise
  },
}))

