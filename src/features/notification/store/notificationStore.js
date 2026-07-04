import { create } from 'zustand'
import { notificationService } from '../services/notificationService'

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async (childId) => {
    set({ isLoading: true, error: null })
    try {
      const [notifications, unreadCount] = await Promise.all([
        notificationService.getByChildId(childId),
        notificationService.countUnread(childId),
      ])
      set({ notifications, unreadCount, isLoading: false })
    } catch (err) {
      set({ isLoading: false, error: err.message })
    }
  },

  markAsRead: async (id) => {
    try {
      const updated = await notificationService.markAsRead(id)
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }))
      return updated
    } catch (err) {
      set({ error: err.message })
    }
  },

  markAllAsRead: async (childId) => {
    try {
      await notificationService.markAllAsRead(childId)
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }))
    } catch (err) {
      set({ error: err.message })
    }
  },

  deleteNotification: async (id) => {
    try {
      await notificationService.deleteNotification(id)
      set((state) => {
        const target = state.notifications.find((n) => n.id === id)
        return {
          notifications: state.notifications.filter((n) => n.id !== id),
          unreadCount: target && !target.isRead
            ? Math.max(0, state.unreadCount - 1)
            : state.unreadCount,
        }
      })
    } catch (err) {
      set({ error: err.message })
    }
  },
}))
