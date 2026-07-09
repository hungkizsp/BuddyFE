import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { GAME_LEVELS } from '../data/gameLevelsData'
import Button from '../../../shared/components/ui/Button'
import './GameLevelPage.css'

/* ═══════════════════════════════════════════════════════════
   SMALL COMPONENTS
═══════════════════════════════════════════════════════════ */

function RoomItem({ item, onClick, status }) {
  return (
    <button
      id={`gl-item-${item.id}`}
      className={`gl-item gl-item--${status}`}
      style={{ left: item.pos.left, top: item.pos.top }}
      onClick={() => onClick(item)}
      aria-label={item.label}
      disabled={status === 'found'}
    >
      <span className="gl-item__emoji">{item.emoji}</span>
      <span className="gl-item__label">{item.label}</span>
    </button>
  )
}

function MissionRow({ mission }) {
  return (
    <div className={`gl-mission ${mission.done ? 'gl-mission--done' : ''}`}>
      <span className="gl-mission__check">{mission.done ? '✅' : '⬜'}</span>
      <span className="gl-mission__text">{mission.text}</span>
    </div>
  )
}

function WordCard({ word }) {
  return (
    <div className="gl-word" style={{ '--word-color': word.color }}>
      <span className="gl-word__badge">{word.type}</span>
      <span className="gl-word__text">{word.word}</span>
    </div>
  )
}

function RewardPanel({ xp, maxXp }) {
  const pct = Math.min((xp / maxXp) * 100, 100)
  return (
    <div className="gl-reward">
      <p className="gl-reward__title">🏅 Rewards</p>
      <div className="gl-reward__row">
        <span className="gl-reward__key">XP</span>
        <div className="gl-reward__bar-wrap">
          <div className="gl-reward__bar" style={{ width: `${pct}%` }} />
        </div>
        <span className="gl-reward__val">+{xp}/{maxXp}</span>
      </div>
      <div className="gl-reward__row">
        <span className="gl-reward__key">Coins</span>
        <span className="gl-reward__coins">🟡 +{Math.floor(xp / 15)}</span>
      </div>
    </div>
  )
}

/* ─── Theme-specific scene decorations ─────────────────── */
function OrcardDecorations() {
  return (
    <>
      <div className="gl-deco gl-deco--sun">☀️</div>
      <div className="gl-deco gl-deco--cloud gl-deco--cloud1">
        <div className="gl-cloud-body">
          <div className="gl-cloud-puff gl-cloud-puff--1" />
          <div className="gl-cloud-puff gl-cloud-puff--2" />
          <div className="gl-cloud-puff gl-cloud-puff--3" />
        </div>
      </div>
      <div className="gl-deco gl-deco--cloud gl-deco--cloud2">
        <div className="gl-cloud-body">
          <div className="gl-cloud-puff gl-cloud-puff--1" />
          <div className="gl-cloud-puff gl-cloud-puff--2" />
          <div className="gl-cloud-puff gl-cloud-puff--3" />
        </div>
      </div>
      {/* Trees */}
      <div className="gl-deco gl-tree gl-tree--left">
        <div className="gl-tree__top" />
        <div className="gl-tree__trunk" />
      </div>
      <div className="gl-deco gl-tree gl-tree--center">
        <div className="gl-tree__top" />
        <div className="gl-tree__trunk" />
      </div>
      <div className="gl-deco gl-tree gl-tree--right">
        <div className="gl-tree__top" />
        <div className="gl-tree__trunk" />
      </div>
      {/* Fence */}
      <div className="gl-deco gl-fence" />
      {/* Grass tufts */}
      <div className="gl-deco gl-grass">🌿🌱🌿🌱🌿🌱🌿🌱🌿🌱🌿</div>
    </>
  )
}

function RestaurantDecorations() {
  return (
    <>
      {/* Windows */}
      <div className="gl-deco gl-win gl-win--left">
        <div className="gl-win__frame" />
        <div className="gl-win__curtain gl-win__curtain--l" />
        <div className="gl-win__curtain gl-win__curtain--r" />
      </div>
      <div className="gl-deco gl-win gl-win--right">
        <div className="gl-win__frame" />
        <div className="gl-win__curtain gl-win__curtain--l" />
        <div className="gl-win__curtain gl-win__curtain--r" />
      </div>
      {/* Pendant lights */}
      <div className="gl-deco gl-pendant gl-pendant--1">
        <div className="gl-pendant__cord" />
        <div className="gl-pendant__shade">💡</div>
      </div>
      <div className="gl-deco gl-pendant gl-pendant--2">
        <div className="gl-pendant__cord" />
        <div className="gl-pendant__shade">💡</div>
      </div>
      {/* Counter / bar at back-wall */}
      <div className="gl-deco gl-counter">
        <div className="gl-counter__top" />
        <div className="gl-counter__front" />
      </div>
      {/* Floor tiles */}
      <div className="gl-deco gl-floor-tiles" />
    </>
  )
}

function FancyDecorations() {
  return (
    <>
      {/* Chandelier */}
      <div className="gl-deco gl-chandelier">
        <div className="gl-chandelier__cord" />
        <div className="gl-chandelier__body">✨</div>
        <div className="gl-chandelier__crystals">
          <span>💎</span><span>💎</span><span>💎</span><span>💎</span><span>💎</span>
        </div>
      </div>
      {/* Velvet curtains */}
      <div className="gl-deco gl-curtain gl-curtain--left" />
      <div className="gl-deco gl-curtain gl-curtain--right" />
      {/* Fancy wall art */}
      <div className="gl-deco gl-wallart gl-wallart--left">🖼️</div>
      <div className="gl-deco gl-wallart gl-wallart--right">🖼️</div>
      {/* Wainscoting / dado rail */}
      <div className="gl-deco gl-dado" />
      {/* Candelabra on sides */}
      <div className="gl-deco gl-candelabra gl-candelabra--left">🕯️</div>
      <div className="gl-deco gl-candelabra gl-candelabra--right">🕯️</div>
      {/* Marble floor lines */}
      <div className="gl-deco gl-marble" />
    </>
  )
}

function SceneDecorations({ theme }) {
  if (theme === 'orchard')    return <OrcardDecorations />
  if (theme === 'restaurant') return <RestaurantDecorations />
  if (theme === 'fancy')      return <FancyDecorations />
  return null
}

/* ─── Win Modal ─────────────────────────────────────────── */
function WinModal({ level, xp, onBack }) {
  return (
    <div className="gl-modal-overlay" role="dialog" aria-modal="true">
      <div className="gl-modal">
        <div className="gl-modal__confetti">🎊🎉🎊🎉🎊</div>
        <div className="gl-modal__emoji">🏆</div>
        <div className="gl-modal__stars">⭐⭐⭐</div>
        <h2 className="gl-modal__title">Level Complete!</h2>
        <p className="gl-modal__level">{level.name}</p>
        <p className="gl-modal__sub">{level.buddyWinSpeech}</p>
        <div className="gl-modal__xp">+{xp} XP earned!</div>
        <Button variant="secondary" className="gl-modal__btn" id="btn-modal-back" onClick={onBack}>
          ← Back to Map
        </Button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function GameLevelPage({ levelId }) {
  const navigate  = useNavigate()
  const level     = GAME_LEVELS[levelId]
  const maxXp     = level.items.filter(i => i.isFood).length * level.xpPerFood

  const [itemStatus, setItemStatus] = useState(
    Object.fromEntries(level.items.map(i => [i.id, 'idle']))
  )
  const [missions,  setMissions]  = useState(level.missions)
  const [feedback,  setFeedback]  = useState(null)
  const [xp,        setXp]        = useState(0)
  const [showWin,   setShowWin]   = useState(false)

  const allDone = missions.every(m => m.done)

  const handleItemClick = useCallback((item) => {
    if (itemStatus[item.id] === 'found') return

    if (item.isFood) {
      // Mark item found
      setItemStatus(prev => ({ ...prev, [item.id]: 'found' }))
      const newXp = xp + level.xpPerFood
      setXp(newXp)

      // Complete mission if it matches and isn't done yet
      let updatedMissions = missions.map(m =>
        m.id === item.missionId && !m.done ? { ...m, done: true } : m
      )
      setMissions(updatedMissions)
      setFeedback({ text: `🎉 Yes! That's ${item.label}!`, ok: true })
      setTimeout(() => setFeedback(null), 1600)

      if (updatedMissions.every(m => m.done)) {
        setTimeout(() => setShowWin(true), 1800)
      }
    } else {
      setItemStatus(prev => ({ ...prev, [item.id]: 'wrong' }))
      setFeedback({ text: `❌ ${item.label} is not food!`, ok: false })
      setTimeout(() => {
        setItemStatus(prev => ({ ...prev, [item.id]: 'idle' }))
        setFeedback(null)
      }, 1100)
    }
  }, [itemStatus, missions, xp, level.xpPerFood])

  return (
    <div className={`gl-page gl-page--${level.theme} app-shell`}>
      {showWin && <WinModal level={level} xp={xp} onBack={() => navigate(level.backRoute)} />}

      {/* ══════════════════════════════════════════
          LEFT SIDEBAR
      ══════════════════════════════════════════ */}
      <aside className="gl-sidebar">
        <Button variant="secondary" className="gl-sidebar__back" onClick={() => navigate(level.backRoute)}>
          ← Map
        </Button>

        {/* Level tag */}
        <div className="gl-level-tag" style={{ '--diff-color': level.difficultyColor }}>
          <span className="gl-level-tag__label">{level.levelLabel}</span>
          <span className="gl-level-tag__diff">{level.difficulty}</span>
        </div>

        {/* Buddy avatar */}
        <div className="gl-buddy-card">
          <div className={`gl-buddy-card__avatar gl-buddy-card__avatar--${level.theme}`}>
            {allDone ? '🥳' : '😊'}
          </div>
          <div className="gl-buddy-card__speech">
            {allDone ? level.buddyWinSpeech : level.buddyInitialSpeech}
          </div>
        </div>

        {/* Missions */}
        <div className="gl-section">
          <p className="gl-section__title">📋 Missions</p>
          <div className="gl-missions">
            {missions.map(m => <MissionRow key={m.id} mission={m} />)}
          </div>
        </div>

        {/* New Words */}
        <div className="gl-section">
          <p className="gl-section__title">📚 New Words</p>
          <div className="gl-words">
            {level.newWords.map(w => <WordCard key={w.id} word={w} />)}
          </div>
        </div>
      </aside>

      {/* ══════════════════════════════════════════
          MAIN ROOM
      ══════════════════════════════════════════ */}
      <main className="gl-main">
        {/* Topbar */}
        <div className="gl-topbar">
          <h1 className="gl-topbar__title">{level.roomTitle}</h1>
          <div className="gl-topbar__right">
            <span className="gl-topbar__instruction">{level.missionInstruction}</span>
            <span className="gl-topbar__stars">☆☆☆</span>
          </div>
        </div>

        {/* Room scene */}
        <div className={`gl-room gl-room--${level.theme}`}>
          {/* Background layers */}
          <div className="gl-room__wall" />
          <div className="gl-room__floor" />

          {/* Theme decorations */}
          <SceneDecorations theme={level.theme} />

          {/* Buddy character */}
          <div className={`gl-buddy-room gl-buddy-room--${level.theme}`}>
            <div className="gl-buddy-room__face">{allDone ? '🥳' : '😊'}</div>
          </div>

          {/* Feedback toast */}
          {feedback && (
            <div className={`gl-feedback ${feedback.ok ? 'gl-feedback--ok' : 'gl-feedback--bad'}`}>
              {feedback.text}
            </div>
          )}

          {/* Clickable items */}
          {level.items.map(item => (
            <RoomItem
              key={item.id}
              item={item}
              onClick={handleItemClick}
              status={itemStatus[item.id]}
            />
          ))}
        </div>

        {/* Hint bar */}
        <div className="gl-hint">
          <span className="gl-hint__icon">💡</span>
          <strong className="gl-hint__label">Buddy&apos;s Hint:</strong>
          <span className="gl-hint__text">{level.hint}</span>
        </div>
      </main>

      {/* ══════════════════════════════════════════
          RIGHT PANEL
      ══════════════════════════════════════════ */}
      <aside className="gl-right">
        <RewardPanel xp={xp} maxXp={maxXp} />

        <div className="gl-badge-card">
          <p className="gl-badge-card__title">🏆 Badge</p>
          <div className="gl-badge-card__badge">{allDone ? '🥇' : '🔒'}</div>
          <p className="gl-badge-card__name">{level.name} Hero</p>
        </div>

        <div className="gl-nextup-card">
          <p className="gl-nextup-card__title">⏭️ Next Up</p>
          {levelId < 4 ? (
            <div className="gl-nextup-card__item">
              <span>{GAME_LEVELS[levelId + 1]?.theme === 'orchard' ? '🌳' : levelId + 1 === 3 ? '🍔' : '🍽️'}</span>
              <span>{GAME_LEVELS[levelId + 1]?.name}</span>
            </div>
          ) : (
            <div className="gl-nextup-card__item">
              <span>🌟</span>
              <span>More coming soon!</span>
            </div>
          )}
        </div>

        <div className="gl-buddyhint-card">
          <p className="gl-buddyhint-card__title">🤫 Buddy&apos;s Hint</p>
          <p className="gl-buddyhint-card__text">{level.hint}</p>
        </div>
      </aside>
    </div>
  )
}
