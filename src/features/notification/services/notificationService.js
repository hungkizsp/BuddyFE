import axiosClient from '../../../shared/api/axiosClient'

export const notificationService = {
  async getByChildId(childId) {
    const res = await axiosClient.get(`/notifications/child/${childId}`)
    return res.data.data
  },

  async getUnread(childId) {
    const res = await axiosClient.get(`/notifications/child/${childId}/unread`)
    return res.data.data
  },

  async countUnread(childId) {
    const res = await axiosClient.get(`/notifications/child/${childId}/unread-count`)
    return res.data.data.unreadCount
  },

  async markAsRead(id) {
    const res = await axiosClient.patch(`/notifications/${id}/read`)
    return res.data.data
  },

  async markAllAsRead(childId) {
    const res = await axiosClient.patch(`/notifications/child/${childId}/read-all`)
    return res.data.data.updatedCount
  },

  async deleteNotification(id) {
    await axiosClient.delete(`/notifications/${id}`)
  },
}
