import { useNavigate } from 'react-router-dom'
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
  const { currentUser, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const user = currentUser || {}

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">🦉</span>
        <span className="brand-name">BuddyEnglish</span>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">{user.nickname?.[0]?.toUpperCase() || '?'}</div>
        <div className="profile-info">
          <p className="profile-name">{user.nickname || 'Learner'}</p>
          <p className="profile-level">Level {user.level ?? 1} Explorer</p>
        </div>
      </div>

      <XpBar xp={user.xp ?? 0} level={user.level ?? 1} />

      <div className="stats-grid">
        <div className="stat-chip">
          <span className="stat-icon">🪙</span>
          <span className="stat-val">{user.coins ?? 0}</span>
          <span className="stat-lbl">Coins</span>
        </div>
        <div className="stat-chip">
          <span className="stat-icon">⭐</span>
          <span className="stat-val">{user.xp ?? 0}</span>
          <span className="stat-lbl">XP</span>
        </div>
        <div className="stat-chip">
          <span className="stat-icon">🔥</span>
          <span className="stat-val">{user.streakDays ?? 0}</span>
          <span className="stat-lbl">Streak</span>
        </div>
        <div className="stat-chip">
          <span className="stat-icon">🏆</span>
          <span className="stat-val">Lv{user.level ?? 1}</span>
          <span className="stat-lbl">Level</span>
        </div>
      </div>

      {/*
       * Sidebar nav — runs across the whole app via HomePage layout.
       * NOTE FOR FUTURE DEVS: If a global NavBar or HeaderBar is added
       * (one that wraps ALL pages, not just HomePage), move the nav items
       * below into that global component instead of keeping them here.
       */}
      <nav className="sidebar-nav">
        <a href="#" className="nav-item active">
          <span>💬</span> Chat with Buddy
        </a>
        <a href="#" className="nav-item">
          <span>📚</span> Vocabulary
        </a>
        <a href="/adventure" className="nav-item">
          <span>🗺️</span> Adventures
        </a>
        <a href="#" className="nav-item">
          <span>🎯</span> Missions
        </a>
        <a href="#" className="nav-item">
          <span>🛒</span> Shop
        </a>
        {/* Link tới trang Notifications đầy đủ */}
        <a
          href="/notifications"
          className="nav-item"
          onClick={(e) => { e.preventDefault(); navigate('/notifications') }}
        >
          <span>🔔</span> Notifications
        </a>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <span>🚪</span> Logout
      </button>
    </aside>
  )
}
