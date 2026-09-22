import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../features/auth/store/authStore'
import { useUIStore } from '../shared/store/uiStore'
import MobileBottomNav from './MobileBottomNav'

function XpBar({ xp, level }) {
  const xpForNext = level * 100
  const pct = Math.min((xp / xpForNext) * 100, 100)
  return (
    <div className="xp-bar-wrap">
      <div className="xp-bar-track">
        <div className="xp-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="xp-label">{xp} / {xpForNext} XP</span>
    </div>
  )
}

export default function SideBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, childProfile, logout } = useAuthStore()
  const { isMobileSidebarOpen, closeMobileSidebar } = useUIStore()

  // Close drawer on route change
  useEffect(() => {
    closeMobileSidebar()
  }, [location.pathname, closeMobileSidebar])

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileSidebarOpen) {
        closeMobileSidebar()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobileSidebarOpen, closeMobileSidebar])

  const handleLogout = async () => {
    closeMobileSidebar()
    await logout()
    navigate('/login')
  }

  const handleNav = (path) => {
    closeMobileSidebar()
    navigate(path)
  }

  const user = currentUser || {}
  const profile = childProfile || {}

  const nickname = profile.nickname || user.nickname || 'Bạn nhỏ'
  const displayLevel = profile.level ?? user.level ?? 1
  const displayXp = profile.xp ?? user.xp ?? 0
  const displayCoins = profile.coins ?? user.coins ?? 0
  const displayStreak = profile.streakDays ?? user.streakDays ?? 0
  const avatarUrl = profile.avatarUrl || profile.activeCustomCharacterUrl || user.avatarUrl

  const pathname = location.pathname

  return (
    <>
      {/* Backdrop overlay for mobile/tablet drawer */}
      {isMobileSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isMobileSidebarOpen ? 'drawer-open' : ''}`}>
        <div className="sidebar-header-row">
          <div className="sidebar-brand cursor-pointer" onClick={() => handleNav('/home')}>
            <span className="brand-icon">🦉</span>
            <span className="brand-name">BollyEnglish</span>
          </div>

          {/* Close button visible only on mobile/tablet drawer */}
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={closeMobileSidebar}
            aria-label="Đóng menu"
          >
            ✕
          </button>
        </div>

        <div className="profile-card">
          <div className="profile-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={nickname} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            ) : (
              nickname[0]?.toUpperCase() || '?'
            )}
          </div>
          <div className="profile-info">
            <p className="profile-name">{nickname}</p>
            <p className="profile-level">Nhà thám hiểm Cấp {displayLevel}</p>
          </div>
        </div>

        <XpBar xp={displayXp} level={displayLevel} />

        <nav className="sidebar-nav">
          <a
            href="/home"
            className={`nav-item ${pathname === '/home' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNav('/home') }}
          >
            <span className="nav-icon">💬</span>
            <span>Trò chuyện với Bolly</span>
          </a>
          <a
            href="/study"
            className={`nav-item ${pathname.startsWith('/study') ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNav('/study') }}
          >
            <span className="nav-icon">📚</span>
            <span>Các Chế Độ Học</span>
          </a>
          <a
            href="/adventure"
            className={`nav-item ${pathname.startsWith('/adventure') || pathname.startsWith('/food-forest') || pathname.startsWith('/foodforest') ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNav('/adventure') }}
          >
            <span className="nav-icon">🗺️</span>
            <span>Bản Đồ Phiêu Lưu</span>
          </a>
          <a
            href="/notifications"
            className={`nav-item ${pathname === '/notifications' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNav('/notifications') }}
          >
            <span className="nav-icon">🔔</span>
            <span>Thông Báo</span>
          </a>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          Đăng Xuất
        </button>
      </aside>

      {/* Global mobile bottom navigation for mobile screens */}
      <MobileBottomNav />
    </>
  )
}

