import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore'
import axiosClient from '../../../shared/api/axiosClient'
import './HomePage.css'

const QUICK_PHRASES = [
  "Hello Buddy! 👋",
  "Teach me a new word!",
  "Let's play a game!",
  "What's today's lesson?",
  "Tell me something fun!",
]

function BuddyAvatar({ mood = 'HAPPY', isTyping = false }) {
  const moodEmoji = {
    HAPPY: '😊',
    EXCITED: '🤩',
    CURIOUS: '🤔',
    PROUD: '😎',
    SLEEPY: '😴',
    SAD: '😢',
  }

  return (
    <div className={`buddy-avatar ${isTyping ? 'buddy-typing' : ''}`}>
      <div className="buddy-face">{moodEmoji[mood] || '😊'}</div>
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
  const { currentUser, logout, loadCurrentUser } = useAuthStore()

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'buddy',
      text: `Hi there! 👋 I'm Buddy, your English learning companion! Ready to learn something new today?`,
    },
  ])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [buddyMood, setBuddyMood] = useState('HAPPY')
  const [vocabHighlight, setVocabHighlight] = useState(null)
  const chatEndRef = useRef(null)

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
    setBuddyMood('CURIOUS')

    try {
      const res = await axiosClient.post('/chatbot/chat', { message: msg })
      const data = res.data?.data || {}

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'buddy', text: data.reply || 'Hmm, let me think... 🤔' },
      ])

      setBuddyMood('HAPPY')

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
          role: 'buddy',
          text: "Oops! I had a little trouble thinking 😅. Please try again!",
        },
      ])
      setBuddyMood('SAD')
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
    <div className="home-root">
      {/* ── Sidebar ── */}
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

        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <span>💬</span> Chat with Buddy
          </a>
          <a href="#" className="nav-item">
            <span>📚</span> Vocabulary
          </a>
          <a href="#" className="nav-item">
            <span>🗺️</span> Adventures
          </a>
          <a href="#" className="nav-item">
            <span>🎯</span> Missions
          </a>
          <a href="#" className="nav-item">
            <span>🛒</span> Shop
          </a>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <span>🚪</span> Logout
        </button>
      </aside>

      {/* ── Main Chat Area ── */}
      <main className="chat-main">
        <header className="chat-header">
          <BuddyAvatar mood={buddyMood} isTyping={isSending} />
          <div className="chat-header-info">
            <h1>Buddy</h1>
            <p className={`buddy-status ${isSending ? 'typing' : 'online'}`}>
              {isSending ? 'Buddy is thinking...' : '● Online & ready to learn!'}
            </p>
          </div>
          <div className="chat-header-actions">
            <button
              className="reset-btn"
              title="Reset conversation"
              onClick={async () => {
                await axiosClient.delete('/chatbot/history')
                setMessages([{ id: Date.now(), role: 'buddy', text: "Let's start fresh! 🌟 What would you like to learn today?" }])
              }}
            >
              🔄 Reset
            </button>
          </div>
        </header>

        {/* Vocabulary pop-up */}
        {vocabHighlight && (
          <div className="vocab-toast">
            <span className="vocab-toast-label">📖 New Word!</span>
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
              {msg.role === 'buddy' && (
                <div className="msg-avatar buddy-msg-avatar">🦉</div>
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
            <div className="message-row buddy">
              <div className="msg-avatar buddy-msg-avatar">🦉</div>
              <div className="message-bubble buddy typing-bubble">
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
            placeholder="Type a message to Buddy..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSending}
            autoFocus
          />
          <button
            className="send-btn"
            type="submit"
            disabled={isSending || !input.trim()}
          >
            {isSending ? '⏳' : '🚀'}
          </button>
        </form>
      </main>
    </div>
  )
}
