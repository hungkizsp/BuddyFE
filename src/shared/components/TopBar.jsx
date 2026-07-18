import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../features/auth/store/authStore'
import { useNotificationStore } from '../../features/notification/store/notificationStore'
import '../styles/TopBar.css'

export const BRAND = {
  blue: '#3B82F6',
  yellow: '#FFB83F',
  navy: '#0F172A',
  coral: '#FF4A5A',
}

// ── SVG Icons ───────────────────────────────────────────────────────────────

function Zap({ size = 12, className, style }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
  )
}

function Flame({ size = 12, className, style }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
    </svg>
  )
}

function Bell({ size = 15, className, style }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
    </svg>
  )
}

function Settings({ size = 15, className, style }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  )
}

// ── Main TopBar Component ──────────────────────────────────────────────────

export default function TopBar({ theme = 'light' }) {
  const navigate = useNavigate()
  const { currentUser, childProfile, profileStats, loadChildProfile, logout } = useAuthStore()
  const { unreadCount, notifications, fetchNotifications, markAllAsRead, markAsRead } = useNotificationStore()

  const [profileOpen, setProfileOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)

  const profileRef = useRef(null)
  const bellRef = useRef(null)

  // Load child profile on mount
  useEffect(() => {
    if (!childProfile) {
      loadChildProfile()
    }
  }, [])

  // Load and poll notifications
  useEffect(() => {
    if (!currentUser?.id) return
    fetchNotifications(currentUser.id)
    const interval = setInterval(() => fetchNotifications(currentUser.id), 60000)
    return () => clearInterval(interval)
  }, [currentUser?.id])

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Fallbacks
  const user = currentUser || {}
  const profile = childProfile || {}
  const stats = profileStats || { vocabularyCount: 0, achievementCount: 0, buddyLevel: 1 }

  const nickname = profile.nickname || user.nickname || 'Learner'
  const displayLevel = profile.level ?? user.level ?? 1
  const displayXp = profile.xp ?? user.xp ?? 0
  const displayCoins = profile.coins ?? user.coins ?? 0
  const displayStreak = profile.streakDays ?? 0

  const initial = nickname[0]?.toUpperCase() || 'A'

  const isDark = theme === 'dark'

  // Dynamic theme variables injected as inline styles
  const themeStyles = isDark ? {
    '--topbar-text': '#ffffff',
    '--topbar-sub': 'rgba(255, 255, 255, 0.55)',
    '--topbar-bg': 'rgba(255, 255, 255, 0.02)',
    '--topbar-border': 'rgba(255, 255, 255, 0.08)',
    '--topbar-hover-bg': 'rgba(255, 255, 255, 0.08)',
    '--topbar-icon': 'rgba(255, 255, 255, 0.6)',
    
    // Popover
    '--popover-bg': '#1e293b',
    '--popover-border': 'rgba(255, 255, 255, 0.08)',
    '--popover-text': '#ffffff',
    '--popover-sub': 'rgba(255, 255, 255, 0.55)',
    '--popover-card-bg': 'rgba(255, 255, 255, 0.03)',
    '--popover-card-border': 'rgba(255, 255, 255, 0.06)',
    '--popover-card-hover': 'rgba(255, 255, 255, 0.08)',
    '--popover-icon-bg': 'rgba(255, 255, 255, 0.06)',
  } : {
    '--topbar-text': BRAND.navy,
    '--topbar-sub': BRAND.navy + '55',
    '--topbar-bg': 'white',
    '--topbar-border': `${BRAND.blue}12`,
    '--topbar-hover-bg': '#EEF6FF',
    '--topbar-icon': BRAND.navy + '55',
    
    // Popover
    '--popover-bg': 'rgba(255, 255, 255, 0.95)',
    '--popover-border': 'rgba(15, 23, 42, 0.08)',
    '--popover-text': '#0f172a',
    '--popover-sub': '#64748b',
    '--popover-card-bg': '#f8fafc',
    '--popover-card-border': '#f1f5f9',
    '--popover-card-hover': '#f1f5f9',
    '--popover-icon-bg': 'white',
  }

  const xpBg = isDark ? 'rgba(59, 130, 246, 0.15)' : `${BRAND.blue}14`
  const xpColor = isDark ? '#60A5FA' : BRAND.blue

  const coinBg = isDark ? 'rgba(251, 191, 36, 0.15)' : `${BRAND.yellow}25`
  const coinColor = isDark ? '#FBBF24' : '#B8860B'

  const streakBg = isDark ? 'rgba(255, 74, 90, 0.15)' : `${BRAND.coral}14`
  const streakColor = isDark ? '#FF4A5A' : BRAND.coral

  return (
    <header
      className="h-13 flex items-center justify-between px-5 flex-shrink-0 relative topbar-header"
      style={{ ...themeStyles, height: 52, zIndex: 100 }}
    >
      {/* User Section (Trigger popover on click) */}
      <div className="topbar-container" ref={profileRef}>
        <div
          className="flex items-center gap-2.5 topbar-profile-trigger"
          onClick={() => setProfileOpen((prev) => !prev)}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black"
            style={{ background: `linear-gradient(135deg, ${BRAND.yellow}, #FFB83F)`, color: BRAND.navy }}
          >
            {initial}
          </div>
          <div className="leading-none text-left">
            <div className="text-sm font-extrabold" style={{ color: 'var(--topbar-text)' }}>
              {nickname}
            </div>
            <div className="text-[10px] font-semibold mt-0.5" style={{ color: 'var(--topbar-sub)' }}>
              Level {displayLevel} Explorer
            </div>
          </div>
        </div>

        {/* Detailed Stats Popover */}
        {profileOpen && (
          <div className="profile-popover" style={{ left: 0 }}>
            <div className="profile-popover-header">
              <div className="profile-popover-title">{nickname}</div>
              <div className="profile-popover-subtitle">Level {displayLevel} Explorer</div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="popover-stat-card">
                <span className="popover-stat-icon">📚</span>
                <div className="popover-stat-info text-left">
                  <span className="popover-stat-label">Từ vựng đã học</span>
                  <span className="popover-stat-value">{stats.vocabularyCount} từ</span>
                </div>
              </div>

              <div className="popover-stat-card">
                <span className="popover-stat-icon">🏆</span>
                <div className="popover-stat-info text-left">
                  <span className="popover-stat-label">Thành tích đạt được</span>
                  <span className="popover-stat-value">{stats.achievementCount} thành tích</span>
                </div>
              </div>

              <div className="popover-stat-card">
                <span className="popover-stat-icon">🤝</span>
                <div className="popover-stat-info text-left">
                  <span className="popover-stat-label">Cấp độ Buddy</span>
                  <span className="popover-stat-value">Cấp {stats.buddyLevel}</span>
                </div>
              </div>
            </div>

            <button className="popover-logout-btn" onClick={handleLogout}>
              Đăng xuất 🚪
            </button>
          </div>
        )}
      </div>

      {/* Center stats pills */}
      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full topbar-stat-pill"
          style={{ background: xpBg }}
          title="Kinh nghiệm tích lũy (XP)"
        >
          <Zap size={12} style={{ color: xpColor }} />
          <span className="text-xs font-extrabold" style={{ color: xpColor }}>
            {displayXp.toLocaleString()} XP
          </span>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full topbar-stat-pill"
          style={{ background: coinBg }}
          title="Số xu hiện tại (Coins)"
        >
          <span className="text-xs">🪙</span>
          <span className="text-xs font-extrabold" style={{ color: coinColor }}>
            {displayCoins.toLocaleString()}
          </span>
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full topbar-stat-pill"
          style={{ background: streakBg }}
          title="Chuỗi học tập liên tục (Streak)"
        >
          <Flame size={12} style={{ color: streakColor }} />
          <span className="text-xs font-extrabold" style={{ color: streakColor }}>
            {displayStreak} days
          </span>
        </div>
      </div>

      {/* Action Buttons (Right) */}
      <div className="flex items-center gap-1" ref={bellRef}>
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors topbar-action-btn relative"
          onClick={() => setBellOpen((prev) => !prev)}
        >
          <Bell size={15} style={{ color: 'var(--topbar-icon)' }} />
          {unreadCount > 0 && (
            <span
              className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full"
              style={{ background: BRAND.coral }}
            />
          )}
        </button>

        {/* Notifications Dropdown Popup */}
        {bellOpen && (
          <div
            className="absolute top-full right-5 mt-2 w-80 rounded-2xl shadow-xl z-[999] overflow-hidden profile-popover"
            style={{ animation: 'popoverFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)', padding: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/20" style={{ borderColor: 'var(--popover-card-border)' }}>
              <span className="text-sm font-extrabold" style={{ color: 'var(--popover-text)' }}>🔔 Thông báo</span>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead(currentUser?.id)}
                  className="text-xs font-bold px-2.5 py-1 rounded-lg transition-colors"
                  style={{ color: '#3B82F6', background: 'rgba(59, 130, 246, 0.1)' }}
                >
                  ✓ Đọc tất cả
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center py-8 px-4 text-slate-400 gap-2">
                  <span className="text-2xl">🔕</span>
                  <p className="text-xs font-semibold">Chưa có thông báo nào</p>
                </div>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => !n.isRead && markAsRead(n.id)}
                    className="flex items-start gap-3 p-3 border-b border-slate-200/10 cursor-pointer hover:bg-slate-500/10 transition-colors text-left"
                    style={{ opacity: n.isRead ? 0.6 : 1, borderColor: 'var(--popover-card-border)' }}
                  >
                    <span className="text-xl flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--popover-icon-bg)' }}>
                      {{ ACHIEVEMENT: '🏆', MISSION: '🎯', REWARD: '🎁', STREAK: '🔥', LEARNING: '📚' }[n.type] || '🔔'}
                    </span>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-xs font-bold truncate" style={{ color: 'var(--popover-text)' }}>{n.title}</p>
                      <p className="text-[11px] line-clamp-2 mt-0.5 leading-snug" style={{ color: 'var(--popover-sub)' }}>{n.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-2 border-t bg-slate-500/5" style={{ borderColor: 'var(--popover-card-border)' }}>
              <button
                onClick={() => {
                  setBellOpen(false)
                  navigate('/notifications')
                }}
                className="w-full text-center py-2 text-xs font-bold hover:opacity-85 rounded-xl transition-all"
                style={{ color: '#3B82F6', background: 'rgba(59, 130, 246, 0.05)' }}
              >
                Xem tất cả thông báo →
              </button>
            </div>
          </div>
        )}

        <button
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors topbar-action-btn"
          onClick={() => navigate('/notifications')}
          title="Settings"
        >
          <Settings size={15} style={{ color: 'var(--topbar-icon)' }} />
        </button>
      </div>
    </header>
  )
}
