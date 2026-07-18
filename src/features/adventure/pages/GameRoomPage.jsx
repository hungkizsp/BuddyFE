import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../../shared/components/ui/Button'
import './GameRoomPage.css'

/* ─── Room items data ────────────────────────────────────── */
// isFood: true = correct answer, false = distractor
const ROOM_ITEMS = [
  // Food items (correct)
  { id: 'apple',    label: 'Apple',    emoji: '🍎', isFood: true,  pos: { left: '26%', top: '30%' }, missionId: 'find-food' },
  { id: 'bread',    label: 'Bread',    emoji: '🍞', isFood: true,  pos: { left: '48%', top: '38%' }, missionId: 'find-food-2' },
  { id: 'milk',     label: 'Milk',     emoji: '🥛', isFood: true,  pos: { left: '68%', top: '44%' }, missionId: 'find-drink' },
  { id: 'banana',   label: 'Banana',   emoji: '🍌', isFood: true,  pos: { left: '14%', top: '52%' }, missionId: 'find-food' },
  { id: 'cookie',   label: 'Cookie',   emoji: '🍪', isFood: true,  pos: { left: '82%', top: '36%' }, missionId: 'find-food-2' },
  // Non-food distractors
  { id: 'lamp',     label: 'Lamp',     emoji: '💡', isFood: false, pos: { left: '20%', top: '18%' } },
  { id: 'book',     label: 'Book',     emoji: '📖', isFood: false, pos: { left: '38%', top: '62%' } },
  { id: 'chair',    label: 'Chair',    emoji: '🪑', isFood: false, pos: { left: '76%', top: '60%' } },
  { id: 'clock',    label: 'Clock',    emoji: '🕐', isFood: false, pos: { left: '62%', top: '16%' } },
  { id: 'picture',  label: 'Picture',  emoji: '🖼️', isFood: false, pos: { left: '56%', top: '22%' } },
]

const MISSIONS = [
  { id: 'find-food',   text: 'Find food to eat',    done: false },
  { id: 'find-food-2', text: 'Find one more food',  done: false },
  { id: 'find-drink',  text: 'Find a drink',        done: false },
]

const NEW_WORDS = [
  { id: 'eat',      word: 'Eat',      type: 'v.',   color: '#4ade80' },
  { id: 'drink',    word: 'Drink',    type: 'n./v.', color: '#60a5fa' },
  { id: 'hungry',   word: 'Hungry',   type: 'adj.', color: '#f97316' },
  { id: 'breakfast',word: 'Breakfast',type: 'n.',   color: '#a78bfa' },
]

/* ─── Sub-components ────────────────────────────────────── */
function RoomItem({ item, onClick, status }) {
  // status: 'idle' | 'correct' | 'wrong' | 'found'
  return (
    <button
      id={`room-item-${item.id}`}
      className={`gr-item gr-item--${status}`}
      style={{ left: item.pos.left, top: item.pos.top }}
      onClick={() => onClick(item)}
      aria-label={item.label}
      disabled={status === 'found'}
    >
      <span className="gr-item__emoji">{item.emoji}</span>
      <span className="gr-item__label">{item.label}</span>
    </button>
  )
}

function MissionRow({ mission }) {
  return (
    <div className={`gr-mission ${mission.done ? 'gr-mission--done' : ''}`}>
      <span className="gr-mission__check">{mission.done ? '✅' : '⬜'}</span>
      <span className="gr-mission__text">{mission.text}</span>
    </div>
  )
}

function WordCard({ word }) {
  return (
    <div className="gr-word" style={{ '--word-color': word.color }}>
      <span className="gr-word__badge">{word.type}</span>
      <span className="gr-word__text">{word.word}</span>
    </div>
  )
}

/* ─── XP / Reward panel ─────────────────────────────────── */
function RewardPanel({ xp, coins }) {
  return (
    <div className="gr-reward">
      <p className="gr-reward__title">🏅 Rewards</p>
      <div className="gr-reward__row">
        <span className="gr-reward__key">XP</span>
        <div className="gr-reward__bar-wrap">
          <div className="gr-reward__bar" style={{ width: `${Math.min(xp / 90 * 100, 100)}%` }} />
        </div>
        <span className="gr-reward__val">+{xp}/90</span>
      </div>
      <div className="gr-reward__row">
        <span className="gr-reward__key">Coins</span>
        <span className="gr-reward__coins">🟡 +{coins}</span>
      </div>
    </div>
  )
}

/* ─── Win Modal ──────────────────────────────────────────── */
function WinModal({ onBack, xp }) {
  return (
    <div className="gr-modal-overlay">
      <div className="gr-modal">
        <div className="gr-modal__stars">⭐⭐⭐</div>
        <div className="gr-modal__emoji">🎉</div>
        <h2 className="gr-modal__title">Breakfast Found!</h2>
        <p className="gr-modal__sub">Great job! Buddy is happy now 😊</p>
        <div className="gr-modal__xp">+{xp} XP earned!</div>
        <Button variant="secondary" className="gr-modal__btn" onClick={onBack}>← Back to Map</Button>
      </div>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────── */
export default function GameRoomPage() {
  const navigate = useNavigate()
  const [itemStatus, setItemStatus] = useState(
    Object.fromEntries(ROOM_ITEMS.map(i => [i.id, 'idle']))
  )
  const [missions, setMissions] = useState(MISSIONS)
  const [feedback, setFeedback] = useState(null)  // { text, ok }
  const [xp, setXp] = useState(0)
  const [coins] = useState(0)
  const [showWin, setShowWin] = useState(false)

  const foundFoodIds = new Set(
    Object.entries(itemStatus).filter(([, v]) => v === 'found').map(([k]) => k)
  )

  const handleItemClick = (item) => {
    if (itemStatus[item.id] === 'found') return

    if (item.isFood) {
      // Correct!
      const newStatus = { ...itemStatus, [item.id]: 'found' }
      setItemStatus(newStatus)
      const gainedXp = xp + 15
      setXp(gainedXp)

      // Update missions
      const updatedMissions = missions.map(m =>
        m.id === item.missionId ? { ...m, done: true } : m
      )
      setMissions(updatedMissions)

      setFeedback({ text: `🎉 Yes! That's ${item.label}!`, ok: true })
      setTimeout(() => setFeedback(null), 1800)

      // Check win: all missions done
      if (updatedMissions.every(m => m.done)) {
        setTimeout(() => setShowWin(true), 2000)
      }
    } else {
      // Wrong – distractor
      setItemStatus(prev => ({ ...prev, [item.id]: 'wrong' }))
      setFeedback({ text: `❌ ${item.label} is not food!`, ok: false })
      setTimeout(() => {
        setItemStatus(prev => ({ ...prev, [item.id]: 'idle' }))
        setFeedback(null)
      }, 1200)
    }
  }

  const allMissionsDone = missions.every(m => m.done)

  return (
    <div className="gr-page app-shell">
      {showWin && <WinModal onBack={() => navigate('/adventure/food-forest')} xp={xp} />}

      {/* ══════════════════════════════════════════
          LEFT SIDEBAR
      ══════════════════════════════════════════ */}
      <aside className="gr-sidebar">
        {/* Back + Level tag */}
        <Button variant="secondary" className="gr-sidebar__back" onClick={() => navigate('/adventure/food-forest')}>
          ← Map
        </Button>
        <div className="gr-sidebar__tag">Adventure 1 – Breakfast Trouble</div>

        {/* Buddy avatar */}
        <div className="gr-buddy-card">
          <div className="gr-buddy-card__avatar">😊</div>
          <div className="gr-buddy-card__speech">
            {allMissionsDone
              ? "Thank you! I'm full now! 🥰"
              : 'Oh no! My tummy is growling! Can you find something I can EAT? 🍽️'}
          </div>
        </div>

        {/* Missions */}
        <div className="gr-section">
          <p className="gr-section__title">📋 Missions</p>
          <div className="gr-missions">
            {missions.map(m => <MissionRow key={m.id} mission={m} />)}
          </div>
        </div>

        {/* New Words */}
        <div className="gr-section">
          <p className="gr-section__title">📚 New Words</p>
          <div className="gr-words">
            {NEW_WORDS.map(w => <WordCard key={w.id} word={w} />)}
          </div>
        </div>
      </aside>

      {/* ══════════════════════════════════════════
          MAIN ROOM CANVAS
      ══════════════════════════════════════════ */}
      <main className="gr-main">

        {/* Room title bar */}
        <div className="gr-topbar">
          <h1 className="gr-topbar__title">🍳 Buddy&apos;s Breakfast Room</h1>
          <div className="gr-topbar__mission">
            🍽️ Find food to eat
            <span className="gr-topbar__stars">☆☆☆</span>
          </div>
        </div>

        {/* Room scene */}
        <div className="gr-room">
          {/* Room wall */}
          <div className="gr-room__wall" />
          {/* Room floor */}
          <div className="gr-room__floor" />

          {/* Ceiling lamp decoration */}
          <div className="gr-room__ceiling-lamp">
            <div className="gr-room__lamp-cord" />
            <div className="gr-room__lamp-shade" />
          </div>

          {/* Window */}
          <div className="gr-room__window">
            <div className="gr-room__window-cross" />
            <div className="gr-room__window-sun">☀️</div>
          </div>

          {/* Table */}
          <div className="gr-room__table">
            <div className="gr-room__table-top" />
            <div className="gr-room__table-legs">
              <div className="gr-room__table-leg" />
              <div className="gr-room__table-leg" />
            </div>
          </div>

          {/* Buddy character in room */}
          <div className="gr-buddy-room">
            <div className="gr-buddy-room__face">😊</div>
          </div>

          {/* Feedback toast */}
          {feedback && (
            <div className={`gr-feedback ${feedback.ok ? 'gr-feedback--ok' : 'gr-feedback--bad'}`}>
              {feedback.text}
            </div>
          )}

          {/* Room items */}
          {ROOM_ITEMS.map(item => (
            <RoomItem
              key={item.id}
              item={item}
              onClick={handleItemClick}
              status={itemStatus[item.id]}
            />
          ))}
        </div>

        {/* Hint bar */}
        <div className="gr-hint">
          <span className="gr-hint__icon">💡</span>
          <span className="gr-hint__label">Buddy&apos;s Hint:</span>
          <span className="gr-hint__text">Look for food you can put in your mouth and chew!</span>
        </div>
      </main>

      {/* ══════════════════════════════════════════
          RIGHT PANEL (XP + Badge + Next Up)
      ══════════════════════════════════════════ */}
      <aside className="gr-right">
        <RewardPanel xp={xp} coins={coins} />

        <div className="gr-badge-card">
          <p className="gr-badge-card__title">🏆 Badge</p>
          <div className="gr-badge-card__badge">🔒</div>
          <p className="gr-badge-card__name">Breakfast Saver</p>
        </div>

        <div className="gr-nextup-card">
          <p className="gr-nextup-card__title">⏭️ Next Up</p>
          <div className="gr-nextup-card__item">
            <span>🍓</span>
            <span>Fruit Hunt</span>
          </div>
        </div>

        <div className="gr-buddyhint-card">
          <p className="gr-buddyhint-card__title">🤫 Buddy&apos;s Hint</p>
          <p className="gr-buddyhint-card__text">
            Look for food you can put in your mouth and chew!
          </p>
        </div>
      </aside>
    </div>
  )
}
