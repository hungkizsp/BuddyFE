import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore'
import { useNotificationStore } from '../store/notificationStore'
import { useNotificationSSE } from '../hooks/useNotificationSSE'
import NotificationList from '../components/NotificationList'
import PageShell from '../../../shared/components/ui/PageShell'
import SectionHeader from '../../../shared/components/ui/SectionHeader'
import Tabs from '../../../shared/components/ui/Tabs'
import StatPill from '../../../shared/components/ui/StatPill'
import GlassCard from '../../../shared/components/ui/GlassCard'
import TopBar from '../../../shared/components/TopBar'

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

  const tabItems = [
    { key: 'all', label: 'All', count: notifications.length },
    { key: 'unread', label: 'Unread', count: unreadCount },
  ]

  return (
    <PageShell>
      <TopBar theme="dark" />

      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-8">
        {/* Header */}
        <SectionHeader
          title="🔔 Notifications"
          subtitle="Stay updated on your achievements, streaks, and learning milestones."
          action={
            unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="px-5 py-2.5 rounded-xl glass-simple border border-primary/20
                           text-primary font-mono text-sm font-bold uppercase
                           hover:bg-primary/10 transition-all"
              >
                ✓ Mark all as read
              </button>
            )
          }
        />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Left: Notification Feed ── */}
          <div className="flex-1">
            {/* Filter Tabs */}
            <Tabs
              items={tabItems}
              active={filter}
              onChange={setFilter}
              className="mb-6"
            />

            {/* Content */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                <p className="font-mono text-sm text-cream/40 uppercase">Loading notifications...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <span className="text-5xl animate-float">🔕</span>
                <p className="font-grotesk text-xl text-cream/70 uppercase">
                  {filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
                </p>
                <p className="font-mono text-sm text-cream/40">
                  {filter === 'unread'
                    ? 'You have read all your notifications.'
                    : 'Start learning to receive achievements and rewards!'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <NotificationList mode="page" items={filtered} />
              </div>
            )}
          </div>

          {/* ── Right: Stats Panel ── */}
          <div className="w-full lg:w-72 space-y-6">
            {/* Stats Card */}
            <GlassCard className="p-5">
              <p className="font-grotesk text-sm font-bold uppercase text-cream/60 tracking-wider mb-4">
                📊 Statistics
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-cream/50 uppercase">Total</span>
                  <span className="font-grotesk text-lg font-bold text-cream">{notifications.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-cream/50 uppercase">Unread</span>
                  <span className="font-grotesk text-lg font-bold text-danger">{unreadCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-cream/50 uppercase">Read</span>
                  <span className="font-grotesk text-lg font-bold text-neon">{readCount}</span>
                </div>
              </div>
            </GlassCard>

            {/* Tips Card */}
            <GlassCard className="p-5">
              <p className="font-grotesk text-sm font-bold uppercase text-cream/60 tracking-wider mb-4">
                💡 Tips
              </p>
              <div className="space-y-3">
                {[
                  { icon: '🏆', title: 'Achievement', desc: 'Complete lessons to earn badges' },
                  { icon: '🔥', title: 'Streak', desc: 'Learn daily to maintain your streak' },
                  { icon: '🎁', title: 'Rewards', desc: 'Earn XP and coins from lessons' },
                  { icon: '🎯', title: 'Missions', desc: 'Complete daily missions for bonus' },
                ].map((tip) => (
                  <div key={tip.title} className="flex items-start gap-3 group">
                    <span className="text-xl flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                      {tip.icon}
                    </span>
                    <div>
                      <p className="font-grotesk text-sm font-bold text-cream/80">{tip.title}</p>
                      <p className="font-mono text-[11px] text-cream/40">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/home')}
            className="font-mono text-sm text-cream/40 hover:text-primary transition-colors uppercase"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </PageShell>
  )
}
