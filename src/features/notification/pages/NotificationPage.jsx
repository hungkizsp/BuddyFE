import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore'
import { useNotificationStore } from '../store/notificationStore'
import { useNotificationSSE } from '../hooks/useNotificationSSE'
import NotificationList from '../components/NotificationList'
import './NotificationPage.css'

const FILTERS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'unread', label: 'Chưa đọc' },
]

const ASIDE_LINKS = [
  { icon: '💬', label: 'Chat with Buddy', href: '/home' },
  { icon: '📚', label: 'Vocabulary',       href: '#' },
  { icon: '🗺️', label: 'Adventures',       href: '/adventure' },
  { icon: '🎯', label: 'Missions',          href: '#' },
  { icon: '🛒', label: 'Shop',              href: '#' },
  { icon: '🔔', label: 'Notifications',     href: '/notifications', active: true },
]

export default function NotificationPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuthStore()
  const { notifications, unreadCount, isLoading, fetchNotifications, markAllAsRead } =
    useNotificationStore()
  const [filter, setFilter] = useState('all')

  useNotificationSSE(currentUser?.id)

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

  const filtered = filter === 'unread'
    ? notifications.filter((n) => !n.isRead)
    : notifications

  const readCount = notifications.filter((n) => n.isRead).length

  return (
    /* Full-viewport dark shell — covers body's #fff9eb background */
    <div className="noti-page-shell">
      <div className="noti-page-layout">

        {/* ── Left sidebar (desktop only) ── */}
        <aside className="noti-page-aside">
          <div className="noti-aside-brand">
            <span className="noti-aside-brand-icon">🦉</span>
            <span className="noti-aside-brand-name">BuddyEnglish</span>
          </div>

          <span className="noti-aside-section-title">Menu</span>
          <nav className="noti-aside-nav">
            {ASIDE_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`noti-aside-link ${link.active ? 'noti-aside-link--active' : ''}`}
                onClick={(e) => {
                  if (link.href && link.href !== '#') {
                    e.preventDefault()
                    navigate(link.href)
                  }
                }}
              >
                <span>{link.icon}</span>
                {link.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* ── Main content ── */}
        <main className="noti-page-root">
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
        </main>

        {/* ── Right info panel (desktop only) ── */}
        <aside className="noti-page-right">
          {/* Stats card */}
          <div className="noti-right-card">
            <p className="noti-right-card-title">📊 Thống kê</p>
            <div className="noti-right-stat">
              <span className="noti-right-stat-label">Tổng thông báo</span>
              <span className="noti-right-stat-val">{notifications.length}</span>
            </div>
            <div className="noti-right-stat">
              <span className="noti-right-stat-label">Chưa đọc</span>
              <span className="noti-right-stat-val" style={{ color: '#f87171' }}>{unreadCount}</span>
            </div>
            <div className="noti-right-stat">
              <span className="noti-right-stat-label">Đã đọc</span>
              <span className="noti-right-stat-val" style={{ color: '#4ade80' }}>{readCount}</span>
            </div>
          </div>

          {/* Tips card */}
          <div className="noti-right-card">
            <p className="noti-right-card-title">💡 Mẹo hay</p>
            <div className="noti-right-tip">
              <span className="noti-right-tip-icon">🏆</span>
              <p className="noti-right-tip-text">
                <strong>Achievement</strong>
                Hoàn thành bài học để nhận huy hiệu
              </p>
            </div>
            <div className="noti-right-tip">
              <span className="noti-right-tip-icon">🔥</span>
              <p className="noti-right-tip-text">
                <strong>Streak</strong>
                Học mỗi ngày để duy trì chuỗi ngày học
              </p>
            </div>
            <div className="noti-right-tip">
              <span className="noti-right-tip-icon">🎁</span>
              <p className="noti-right-tip-text">
                <strong>Phần thưởng</strong>
                Kiếm XP và coins từ mỗi bài học
              </p>
            </div>
            <div className="noti-right-tip">
              <span className="noti-right-tip-icon">🎯</span>
              <p className="noti-right-tip-text">
                <strong>Nhiệm vụ</strong>
                Hoàn thành nhiệm vụ hàng ngày để tăng điểm
              </p>
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}
