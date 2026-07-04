import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore'
import { useNotificationStore } from '../store/notificationStore'
import NotificationList from '../components/NotificationList'
import './NotificationBell.css'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const popupRef = useRef(null)
  const navigate = useNavigate()

  const { currentUser } = useAuthStore()
  const { unreadCount, fetchNotifications, markAllAsRead } = useNotificationStore()

  // Fetch khi mount và poll mỗi 60s
  useEffect(() => {
    if (!currentUser?.id) return
    fetchNotifications(currentUser.id)
    const interval = setInterval(() => fetchNotifications(currentUser.id), 60000)
    return () => clearInterval(interval)
  }, [currentUser?.id])

  // Đóng popup khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const handleMarkAllRead = async () => {
    if (!currentUser?.id) return
    await markAllAsRead(currentUser.id)
  }

  return (
    <div className="noti-bell-wrapper" ref={popupRef}>
      {/* Bell trigger */}
      <button
        className={`noti-bell-btn ${open ? 'noti-bell-btn--active' : ''}`}
        onClick={() => setOpen((v) => !v)}
        title="Thông báo"
      >
        <span className="noti-bell-icon">🔔</span>
        <span className="noti-bell-label">Thông báo</span>
        {unreadCount > 0 && (
          <span className="noti-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {/* Dropdown popup */}
      {open && (
        <div className="noti-popup">
          <div className="noti-popup-header">
            <h3 className="noti-popup-title">Thông báo</h3>
            {unreadCount > 0 && (
              <button className="noti-popup-mark-all" onClick={handleMarkAllRead}>
                ✓ Đọc tất cả
              </button>
            )}
          </div>

          <div className="noti-popup-body">
            <NotificationList mode="popup" maxItems={5} />
          </div>

          <div className="noti-popup-footer">
            <button
              className="noti-popup-view-all"
              onClick={() => { setOpen(false); navigate('/notifications') }}
            >
              Xem tất cả thông báo →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
