import { useNavigate, useLocation } from 'react-router-dom'
import { useNotificationStore } from '../features/notification/store/notificationStore'

export default function MobileBottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const unreadCount = useNotificationStore((s) => s.unreadCount)

  const pathname = location.pathname

  const navItems = [
    {
      label: 'Trò Chuyện',
      path: '/home',
      icon: '💬',
      isActive: pathname === '/home',
    },
    {
      label: 'Ôn Tập',
      path: '/study',
      icon: '📚',
      isActive: pathname.startsWith('/study'),
    },
    {
      label: 'Phiêu Lưu',
      path: '/adventure',
      icon: '🗺️',
      isActive: pathname.startsWith('/adventure') || pathname.startsWith('/food-forest') || pathname.startsWith('/foodforest'),
    },
    {
      label: 'Thông Báo',
      path: '/notifications',
      icon: '🔔',
      badge: unreadCount,
      isActive: pathname === '/notifications',
    },
  ]

  return (
    <nav className="mobile-bottom-nav md:hidden" aria-label="Mobile Navigation">
      <div className="mobile-bottom-nav-inner">
        {navItems.map((item) => (
          <button
            key={item.path}
            type="button"
            className={`mobile-bottom-nav-item ${item.isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <div className="mobile-bottom-nav-icon-wrap">
              <span className="mobile-bottom-nav-icon">{item.icon}</span>
              {Boolean(item.badge && item.badge > 0) && (
                <span className="mobile-bottom-nav-badge">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </div>
            <span className="mobile-bottom-nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
