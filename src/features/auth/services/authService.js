import axiosClient from '../../../shared/api/axiosClient'

export const authService = {
  async login(credentials) {
    const response = await axiosClient.post('/auth/login', credentials)
    return response.data.data
  },

  async loginWithGoogle(data) {
    const response = await axiosClient.post('/auth/google', data)
    return response.data.data
  },

  async signup(data) {
    const response = await axiosClient.post('/auth/register', data)
    return response.data.data
  },

  async verifyEmail(data) {
    const response = await axiosClient.post('/auth/verify-email', data)
    return response.data.data
  },

  async resendOtp(email) {
    const response = await axiosClient.post(`/auth/resend-otp?email=${encodeURIComponent(email)}`)
    return response.data.data
  },

  async forgotPassword(data) {
    const response = await axiosClient.post('/auth/forgot-password', data)
    return response.data.data
  },

  async resetPassword(data) {
    const response = await axiosClient.post('/auth/reset-password', data)
    return response.data.data
  },

  async getCurrentUser() {
    const response = await axiosClient.get('/auth/me')
    return response.data.data
  },

  async logout() {
    await axiosClient.post('/auth/logout')
  },

  async refreshToken() {
    const response = await axiosClient.post('/auth/refresh')
    return response.data.data
  },
}
