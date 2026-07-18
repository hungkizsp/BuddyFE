import { useEffect } from 'react'
import { useNotificationStore } from '../store/notificationStore'

export function useNotificationSSE(childId) {
  const { addNotification } = useNotificationStore()

  useEffect(() => {
    if (!childId) return

    // Ensure we use the correct base URL
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
    
    // withCredentials: true ensures that cookies (like JWT) are sent
    const eventSource = new EventSource(`${baseUrl}/api/sse/notifications/${childId}`, {
      withCredentials: true,
    })

    eventSource.onmessage = (event) => {
      // By default, messages without an event name are handled here
    }

    eventSource.addEventListener('NEW_NOTIFICATION', (event) => {
      try {
        const newNotification = JSON.parse(event.data)
        addNotification(newNotification)
      } catch (err) {
        console.error('Failed to parse NEW_NOTIFICATION:', err)
      }
    })

    eventSource.addEventListener('CONNECTED', (event) => {
      console.log('SSE Connected:', event.data)
    })

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error)
      // EventSource will automatically try to reconnect.
    }

    return () => {
      eventSource.close()
    }
  }, [childId, addNotification])
}
