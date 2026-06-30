import axiosClient from '../../../shared/api/axiosClient'

export const authService = {
  async login(credentials) {
    const response = await axiosClient.post('/auth/login', credentials)
    return response.data.data
  },

  async signup(data) {
    const response = await axiosClient.post('/auth/register', data)
    return response.data.data
  },

  async getCurrentUser() {
    const response = await axiosClient.get('/auth/me')
    return response.data.data
  },

  async logout() {
    await axiosClient.post('/auth/logout')
  },
}
