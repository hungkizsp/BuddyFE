import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore'
import { useNotificationStore } from '../../notification/store/notificationStore'
import { useNotificationSSE } from '../../notification/hooks/useNotificationSSE'
import axiosClient from '../../../shared/api/axiosClient'
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, ContactShadows } from '@react-three/drei'
import BollyModel from '../../../shared/components/BollyModel'
import DynamicBollyModel from '../../../shared/components/DynamicBollyModel'
import TopBar from '../../../shared/components/TopBar'
import SideBar from '../../../layouts/SideBar'
import Button from '../../../shared/components/ui/Button'
import './HomePage.css'

const QUICK_PHRASES = [
  "Hello Bolly! 👋",
  "Dạy mình một từ mới!",
  "Cùng chơi trò chơi nào!",
  "Bài học hôm nay là gì?",
  "Kể cho mình nghe điều gì vui đi!",
]

function BollyAvatar({ mood = 'HAPPY', isTyping = false, modelPath = null }) {
  return (
    <div className={`bolly-avatar ${isTyping ? 'bolly-typing' : ''}`} style={{ width: '64px', height: '64px', padding: 0, overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 1.2, 3.5], fov: 50 }} style={{ width: '100%', height: '100%' }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <Environment preset="city" />
        <Suspense fallback={null}>
          <DynamicBollyModel modelPath={modelPath} scale={1.5} position={[0, -1.2, 0]} />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      {isTyping && (
        <div className="typing-dots">
          <span /><span /><span />
        </div>
      )}
    </div>
  )
}

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

export default function HomePage() {
  const navigate = useNavigate()
  const { currentUser, logout, loadCurrentUser, childProfile } = useAuthStore()
  const { unreadCount, notifications, markAllAsRead, markAsRead } = useNotificationStore()
  useNotificationSSE(currentUser?.id)

  const [messages, setMessages] = useState([
    {
      id: 1,
<<<<<<< HEAD
      role: 'bolly',
=======
      role: 'buddy',
>>>>>>> 90ebad3 (update(rename): Rename all content game from buddy into bolly.)
      text: `Chào bé! 👋 Mình là Bolly, bạn đồng hành học tiếng Anh của bé đây! Bé đã sẵn sàng học điều mới hôm nay chưa?`,
    },
  ])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [bollyMood, setBollyMood] = useState('HAPPY')
  const [vocabHighlight, setVocabHighlight] = useState(null)
  const chatEndRef = useRef(null)
  // Bell popup state
  const [bellOpen, setBellOpen] = useState(false)
  const bellRef = useRef(null)

  // Close bell popup on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false)
    }
    if (bellOpen) document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [bellOpen])

  useEffect(() => {
    if (!currentUser) {
      loadCurrentUser().catch(() => navigate('/login'))
    }
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg || isSending) return

    setInput('')
    setMessages((prev) => [...prev, { id: Date.now(), role: 'child', text: msg }])
    setIsSending(true)
    setBollyMood('CURIOUS')

    try {
      const res = await axiosClient.post('/chatbot/chat', { message: msg })
      const data = res.data?.data || {}

      setMessages((prev) => [
        ...prev,
<<<<<<< HEAD
        { id: Date.now() + 1, role: 'bolly', text: data.reply || 'Hmm, để Bolly suy nghĩ chút nha... 🤔' },
=======
        { id: Date.now() + 1, role: 'buddy', text: data.reply || 'Hmm, để Bolly suy nghĩ chút nha... 🤔' },
>>>>>>> 90ebad3 (update(rename): Rename all content game from buddy into bolly.)
      ])

      setBollyMood('HAPPY')

      if (data.vocabularyWord) {
        setVocabHighlight({
          word: data.vocabularyWord,
          meaning: data.vocabularyMeaning,
          category: data.vocabularyCategory,
        })
        setTimeout(() => setVocabHighlight(null), 8000)
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
<<<<<<< HEAD
          role: 'bolly',
=======
          role: 'buddy',
>>>>>>> 90ebad3 (update(rename): Rename all content game from buddy into bolly.)
          text: "Ôi! Bolly gặp chút trục trặc khi suy nghĩ 😅. Bé thử lại nhé!",
        },
      ])
      setBollyMood('SAD')
    } finally {
      setIsSending(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const user = currentUser || {}

  return (
    <div className="home-root app-shell">
      <div className="noise-overlay" aria-hidden="true" />
      <SideBar />

      {/* ── Main Chat Area ── */}

      {/* ── Main Chat Area ── */}
      <main className="chat-main">
        <TopBar theme="dark" />
        <header className="chat-header">
          <BollyAvatar mood={bollyMood} isTyping={isSending} modelPath={childProfile?.activeCustomCharacterUrl} />
          <div className="chat-header-info">
            <h1>Bolly</h1>
<<<<<<< HEAD
            <p className={`bolly-status ${isSending ? 'typing' : 'online'}`}>
=======
            <p className={`buddy-status ${isSending ? 'typing' : 'online'}`}>
>>>>>>> 90ebad3 (update(rename): Rename all content game from buddy into bolly.)
              {isSending ? 'Bolly đang suy nghĩ...' : '● Đang hoạt động & sẵn sàng học cùng bé!'}
            </p>
          </div>
          <div className="chat-header-actions">
            {/* Bell popup in chat header — shows mini notification bubble */}
            <div
              ref={bellRef}
              style={{ position: 'relative', marginRight: '8px', display: 'inline-block' }}
            >
              {/* Mini notification bubble popup */}
              {bellOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  width: '320px', background: '#1e293b',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,179,237,0.08)',
                  zIndex: 9999, overflow: 'hidden',
                  animation: 'notiHeaderPopIn 0.2s cubic-bezier(0.16,1,0.3,1)',
                }}>
                  {/* Header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px 10px',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                  }}>
                    <span style={{
                      fontSize: '14px', fontWeight: 800,
                      background: 'linear-gradient(90deg,#63b3ed,#9f7aea)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>🔔 Thông báo</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllAsRead(currentUser?.id)}
                        style={{
                          background: 'rgba(99,179,237,0.1)', border: '1px solid rgba(99,179,237,0.2)',
                          color: '#63b3ed', fontSize: '11px', fontWeight: 600,
                          cursor: 'pointer', padding: '4px 10px', borderRadius: '8px',
                        }}
                      >✓ Đọc tất cả</button>
                    )}
                  </div>

                  {/* List */}
                  <div style={{ maxHeight: '280px', overflowY: 'auto', scrollbarWidth: 'thin' }}>
                    {notifications.length === 0 ? (
                      <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        padding: '32px 16px', color: '#475569', gap: '8px',
                      }}>
                        <span style={{ fontSize: '28px', opacity: 0.5 }}>🔕</span>
                        <p style={{ margin: 0, fontSize: '13px' }}>Chưa có thông báo nào</p>
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => !n.isRead && markAsRead(n.id)}
                          style={{
                            display: 'flex', alignItems: 'flex-start', gap: '10px',
                            padding: '11px 14px',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            background: n.isRead ? 'transparent' : 'rgba(99,179,237,0.06)',
                            cursor: n.isRead ? 'default' : 'pointer',
                            transition: 'background 0.15s',
                            position: 'relative',
                          }}
                        >
                          {!n.isRead && (
                            <span style={{
                              position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
                              background: 'linear-gradient(180deg,#63b3ed,#9f7aea)',
                              borderRadius: '0 2px 2px 0',
                            }} />
                          )}
                          <span style={{
                            fontSize: '18px', width: '32px', height: '32px', flexShrink: 0,
                            borderRadius: '50%', background: 'rgba(255,255,255,0.07)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {{ ACHIEVEMENT: '🏆', MISSION: '🎯', REWARD: '🎁', STREAK: '🔥', LEARNING: '📚' }[n.type] || '🔔'}
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{
                              margin: '0 0 2px', fontSize: '12px', fontWeight: 600,
                              color: n.isRead ? '#64748b' : '#e2e8f0',
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>{n.title}</p>
                            <p style={{
                              margin: 0, fontSize: '11px', color: '#64748b', lineHeight: 1.4,
                              overflow: 'hidden', display: '-webkit-box',
                              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                            }}>{n.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  <div style={{ padding: '8px 14px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <button
                      onClick={() => { setBellOpen(false); navigate('/notifications') }}
                      style={{
                        width: '100%', background: 'rgba(99,179,237,0.07)',
                        border: '1px solid rgba(99,179,237,0.15)', color: '#63b3ed',
                        fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                        padding: '7px', borderRadius: '10px', transition: 'all 0.2s',
                      }}
                    >Xem tất cả thông báo →</button>
                  </div>
                </div>
              )}
            </div>
            <Button
              variant="secondary"
              className="reset-btn"
              title="Bắt đầu lại cuộc trò chuyện"
              onClick={async () => {
                await axiosClient.delete('/chatbot/history')
                setMessages([{ id: Date.now(), role: 'bolly', text: "Cùng bắt đầu lại từ đầu nào! 🌟 Hôm nay bé muốn học từ vựng gì?" }])
              }}
            >
              🔄 Đặt lại
            </Button>
          </div>
        </header>

        {/* Vocabulary pop-up */}
        {vocabHighlight && (
          <div className="vocab-toast">
            <span className="vocab-toast-label">📖 Từ vựng mới!</span>
            <span className="vocab-word">{vocabHighlight.word}</span>
            <span className="vocab-sep">→</span>
            <span className="vocab-meaning">{vocabHighlight.meaning}</span>
            {vocabHighlight.category && (
              <span className="vocab-cat">{vocabHighlight.category}</span>
            )}
          </div>
        )}

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-row ${msg.role}`}>
              {msg.role === 'bolly' && (
                <div className="msg-avatar bolly-msg-avatar">🦉</div>
              )}
              <div className={`message-bubble ${msg.role}`}>
                <p>{msg.text}</p>
              </div>
              {msg.role === 'child' && (
                <div className="msg-avatar child-msg-avatar">
                  {user.nickname?.[0]?.toUpperCase() || '?'}
                </div>
              )}
            </div>
          ))}
          {isSending && (
            <div className="message-row bolly">
              <div className="msg-avatar bolly-msg-avatar">🦉</div>
              <div className="message-bubble bolly typing-bubble">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick phrases */}
        <div className="quick-phrases">
          {QUICK_PHRASES.map((phrase) => (
            <button
              key={phrase}
              className="phrase-chip"
              onClick={() => sendMessage(phrase)}
              disabled={isSending}
            >
              {phrase}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          className="chat-input-bar"
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage()
          }}
        >
          <input
            className="chat-input"
            type="text"
            placeholder="Nhắn tin cho Bolly tại đây..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSending}
            autoFocus
          />
          <Button
            className="send-btn"
            type="submit"
            disabled={isSending || !input.trim()}
          >
            {isSending ? '⏳' : '🚀'}
          </Button>
        </form>
      </main>
    </div>
  )
}
