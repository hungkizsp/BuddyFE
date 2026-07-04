import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore'
import { useNotificationStore } from '../store/notificationStore'
import NotificationList from '../components/NotificationList'
import './NotificationPage.css'

const FILTERS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'unread', label: 'Chưa đọc' },
]

export default function NotificationPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuthStore()
  const { notifications, unreadCount, isLoading, fetchNotifications, markAllAsRead } =
    useNotificationStore()
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!currentUser?.id) {
      navigate('/login')
      return
    }
    fetchNotifications(currentUser.id)
  }, [currentUser?.id])

  const handleMarkAll = async () => {
    if (!currentUser?.id) return
    await markAllAsRead(currentUser.id)
  }

  // Lọc client-side dựa trên store đã có
  const filtered = filter === 'unread'
    ? notifications.filter((n) => !n.isRead)
    : notifications

  return (
    <div className="noti-page-root">
      {/* Header */}
      <header className="noti-page-header">
        <button className="noti-page-back" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>
        <div className="noti-page-title-wrap">
          <h1 className="noti-page-title">🔔 Thông báo</h1>
          {unreadCount > 0 && (
            <span className="noti-page-count">{unreadCount} chưa đọc</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button className="noti-page-mark-all" onClick={handleMarkAll}>
            ✓ Đọc tất cả
          </button>
        )}
      </header>

      {/* Filter tabs */}
      <div className="noti-page-filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`noti-filter-tab ${filter === f.key ? 'noti-filter-tab--active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            {f.key === 'unread' && unreadCount > 0 && (
              <span className="noti-filter-badge">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="noti-page-content">
        {isLoading ? (
          <div className="noti-page-loading">
            <div className="noti-page-spinner" />
            <p>Đang tải thông báo...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="noti-page-empty">
            <span>🔕</span>
            <p>{filter === 'unread' ? 'Không có thông báo chưa đọc' : 'Chưa có thông báo nào'}</p>
          </div>
        ) : (
          <div className="noti-page-list-wrap">
            <NotificationList mode="page" items={filtered} />
          </div>
        )}
      </div>
    </div>
  )
}
