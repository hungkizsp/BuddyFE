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
  isInitializing: true,  // true until the initial session check completes
  isLoading: false,
  error: null,

  login: async ({ email, password }) => {
    set({ isLoading: true, error: null })

    try {
      const user = await authService.login({ email, password })
      if (user?.accessToken) {
        localStorage.setItem('access_token', user.accessToken)
      }
      set({
        currentUser: user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
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

  loginWithGoogle: async ({ idToken, email, name }) => {
    set({ isLoading: true, error: null })

    try {
      const user = await authService.loginWithGoogle({ idToken, email, name })
      if (user?.accessToken) {
        localStorage.setItem('access_token', user.accessToken)
      }
      set({
        currentUser: user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
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
      if (user?.accessToken) {
        localStorage.setItem('access_token', user.accessToken)
      }
      set({
        currentUser: user,
        isAuthenticated: false, // Wait for email OTP verification
        isLoading: false,
        error: null,
      })
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

  verifyEmail: async ({ email, otp }) => {
    set({ isLoading: true, error: null })

    try {
      const user = await authService.verifyEmail({ email, otp })
      if (user?.accessToken) {
        localStorage.setItem('access_token', user.accessToken)
      }
      set({
        currentUser: user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
      await get().loadChildProfile()
      return user
    } catch (error) {
      set({ isLoading: false, error: error.message })
      throw error
    }
  },

  resendOtp: async (email) => {
    try {
      await authService.resendOtp(email)
    } catch (error) {
      console.error('Failed to resend OTP:', error)
      throw error
    }
  },

  forgotPassword: async ({ email }) => {
    set({ isLoading: true, error: null })

    try {
      await authService.forgotPassword({ email })
      set({ isLoading: false, error: null })
    } catch (error) {
      set({ isLoading: false, error: error.message })
      throw error
    }
  },

  resetPassword: async ({ email, otp, newPassword }) => {
    set({ isLoading: true, error: null })

    try {
      await authService.resetPassword({ email, otp, newPassword })
      set({ isLoading: false, error: null })
    } catch (error) {
      set({ isLoading: false, error: error.message })
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
        isInitializing: false,
        isLoading: false,
        error: null,
      })
      await get().loadChildProfile()
      return user
    } catch (error) {
      set({
        currentUser: null,
        childProfile: null,
        profileStats: null,
        isAuthenticated: false,
        isInitializing: false,
        isLoading: false,
      })
      return null
    }
  },

  logout: async () => {
    try {
      await authService.logout()
    } finally {
      localStorage.removeItem('access_token')
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
        const [vocabRes, achievementRes, bollyRes] = await Promise.all([
          axiosClient.get(`/progress/vocabularies?childId=${childId}`),
          axiosClient.get(`/child-achievements?childId=${childId}`),
          axiosClient.get('/buddy/profiles'),
        ])

        const vocabularyCount = vocabRes.data.data?.length || 0
        const achievementCount =
          achievementRes.data.data?.filter((a) => a.earnedAt != null).length || 0
        const myBolly = bollyRes.data.data?.find((b) => b.childId === childId)
        const bollyLevel = myBolly ? myBolly.level : 1

        const stats = {
          vocabularyCount,
          achievementCount,
          bollyLevel,
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
