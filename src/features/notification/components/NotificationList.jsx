import { useNotificationStore } from '../store/notificationStore'
import './NotificationList.css'

const TYPE_ICON = {
  ACHIEVEMENT: '🏆',
  MISSION: '🎯',
  REWARD: '🎁',
  SYSTEM: '🔔',
  LEARNING: '📚',
  STREAK: '🔥',
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Vừa xong'
  if (mins < 60) return `${mins} phút trước`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} giờ trước`
  const days = Math.floor(hours / 24)
  return `${days} ngày trước`
}

/**
 * @param {object}   props
 * @param {'page'|'popup'} props.mode     - 'popup' for dropdown, 'page' for full page
 * @param {number}   [props.maxItems=5]   - used when mode='popup'
 * @param {Array}    [props.items]        - optional override list (e.g. pre-filtered)
 */
export default function NotificationList({ mode = 'page', maxItems = 5, items }) {
  const { notifications, isLoading, markAsRead, deleteNotification } =
    useNotificationStore()

  // Use provided items (filtered) or fall back to store list
  const source = items ?? notifications
  const displayed = mode === 'popup' ? source.slice(0, maxItems) : source

  if (isLoading) {
    return (
      <div className="noti-list-empty">
        <div className="noti-spinner" />
        <p>Đang tải thông báo...</p>
      </div>
    )
  }

  if (displayed.length === 0) {
    return (
      <div className="noti-list-empty">
        <span className="noti-empty-icon">🔕</span>
        <p>Chưa có thông báo nào</p>
      </div>
    )
  }

  return (
    <ul className={`noti-list noti-list--${mode}`}>
      {displayed.map((n) => (
        <li key={n.id} className={`noti-item ${n.isRead ? 'noti-item--read' : 'noti-item--unread'}`}>
          <div className="noti-icon">
            {TYPE_ICON[n.type] || TYPE_ICON.SYSTEM}
          </div>
          <div className="noti-content">
            <p className="noti-title">{n.title}</p>
            <p className="noti-message">{n.message}</p>
            <span className="noti-time">{timeAgo(n.createdAt)}</span>
          </div>
          <div className="noti-actions">
            {!n.isRead && (
              <button
                className="noti-btn noti-btn--read"
                title="Đánh dấu đã đọc"
                onClick={() => markAsRead(n.id)}
              >
                ✓
              </button>
            )}
            {mode === 'page' && (
              <button
                className="noti-btn noti-btn--delete"
                title="Xóa"
                onClick={() => deleteNotification(n.id)}
              >
                ✕
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
