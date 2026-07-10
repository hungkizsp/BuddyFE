import axiosClient from '../../../shared/api/axiosClient'

const profileService = {
  async updateChildProfile(data) {
    const response = await axiosClient.put('/profile/child', data)
    return response.data?.data ?? response.data
  },
}

export default profileService
