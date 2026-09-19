import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../features/auth/store/authStore'

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

  const handleLogout = async () => {
    await logout()
    navigate('/login')
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
    <aside className="sidebar">
      <div className="sidebar-brand cursor-pointer" onClick={() => navigate('/home')}>
        <span className="brand-icon">🦉</span>
        <span className="brand-name">BuddyEnglish</span>
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

      <div className="stats-grid">
        <div className="stat-chip">
          <span className="stat-icon">🪙</span>
          <span className="stat-val">{displayCoins}</span>
          <span className="stat-lbl">Xu</span>
        </div>
        <div className="stat-chip">
          <span className="stat-icon">⭐</span>
          <span className="stat-val">{displayXp}</span>
          <span className="stat-lbl">XP</span>
        </div>
        <div className="stat-chip">
          <span className="stat-icon">🔥</span>
          <span className="stat-val">{displayStreak}</span>
          <span className="stat-lbl">Chuỗi ngày</span>
        </div>
        <div className="stat-chip">
          <span className="stat-icon">🏆</span>
          <span className="stat-val">Cấp {displayLevel}</span>
          <span className="stat-lbl">Cấp độ</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <a
          href="/home"
          className={`nav-item ${pathname === '/home' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); navigate('/home') }}
        >
          <span>💬</span> Trò chuyện với Buddy
        </a>
        <a
          href="/study"
          className={`nav-item ${pathname.startsWith('/study') ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); navigate('/study') }}
        >
          <span>📖</span> Các Chế Độ Học
        </a>
        <a
          href="/adventure"
          className={`nav-item ${pathname.startsWith('/adventure') ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); navigate('/adventure') }}
        >
          <span>🗺️</span> Bản Đồ Phiêu Lưu
        </a>
        <a
          href="/character-creator"
          className={`nav-item ${pathname === '/character-creator' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); navigate('/character-creator') }}
        >
          <span>🎨</span> Tạo Nhân Vật
        </a>
        <a
          href="/notifications"
          className={`nav-item ${pathname === '/notifications' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); navigate('/notifications') }}
        >
          <span>🔔</span> Thông Báo
        </a>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <span>🚪</span> Đăng Xuất
      </button>
    </aside>
  )
}
