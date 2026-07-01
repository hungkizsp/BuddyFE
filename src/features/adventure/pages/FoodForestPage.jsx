import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/FoodForestPage.css'

/* ─── Missions ──────────────────────────────────────────── */
const MISSIONS = [
  {
    id: 'breakfast-trouble',
    name: 'Breakfast Trouble',
    x: 16, y: 62,
    locked: false,
    stars: 2,
    maxStars: 3,
    tooltip: "I'm a little hungry…",
    difficulty: 'Easy', diffColor: '#22c55e',
  },
  {
    id: 'fruit-hunt',
    name: 'Fruit Hunt',
    x: 33, y: 50,
    locked: false,
    stars: 0,
    maxStars: 3,
    tooltip: "Let's pick some yummy fruits! 🍎",
    difficulty: 'Easy+', diffColor: '#84cc16',
  },
  {
    id: 'lunch-time',
    name: 'Lunch Time',
    x: 52, y: 58,
    locked: false,
    stars: 0,
    maxStars: 3,
    tooltip: "Help Buddy order at the food court! 🍔",
    difficulty: 'Medium', diffColor: '#f59e0b',
  },
  {
    id: 'buddys-restaurant',
    name: "Buddy's Restaurant",
    x: 69, y: 44,
    locked: false,
    stars: 0,
    maxStars: 3,
    tooltip: "Fine dining adventure at Buddy's! 🍽️",
    difficulty: 'Medium+', diffColor: '#8b5cf6',
  },
  {
    id: 'supermarket-mission',
    name: 'Supermarket Mission',
    x: 86, y: 56,
    locked: true,
    stars: 0,
    maxStars: 3,
    difficulty: 'Hard', diffColor: '#ef4444',
  },

]

const TREES = [
  { x: 10, y: 70, size: 1.0 },
  { x: 24, y: 75, size: 0.8 },
  { x: 40, y: 72, size: 1.1 },
  { x: 58, y: 68, size: 0.9 },
  { x: 62, y: 76, size: 0.7 },
  { x: 76, y: 71, size: 1.0 },
  { x: 92, y: 73, size: 0.85 },
  { x: 5,  y: 66, size: 0.75 },
  { x: 97, y: 66, size: 0.7 },
]

const FRUITS = [
  { x: 44, y: 60, icon: '🍎' },
  { x: 66, y: 62, icon: '🍐' },
]

const CLOUDS = [
  { x: 8,  y: 8,  size: 0.9 },
  { x: 28, y: 5,  size: 0.7 },
  { x: 52, y: 10, size: 0.8 },
  { x: 72, y: 6,  size: 0.65 },
  { x: 85, y: 11, size: 0.75 },
]

/* ─── Sub-components ────────────────────────────────────── */
function StarRating({ stars, maxStars, size = 'md' }) {
  return (
    <div className={`ff-stars ff-stars--${size}`}>
      {Array.from({ length: maxStars }).map((_, i) => (
        <span key={i} className={`ff-star ${i < stars ? 'ff-star--filled' : 'ff-star--empty'}`}>★</span>
      ))}
    </div>
  )
}

function Cloud({ x, y, size }) {
  return (
    <div className="ff-cloud" style={{ left: `${x}%`, top: `${y}%`, transform: `scale(${size})`, transformOrigin: 'left top' }}>
      <div className="ff-cloud__body">
        <div className="ff-cloud__puff ff-cloud__puff--1" />
        <div className="ff-cloud__puff ff-cloud__puff--2" />
        <div className="ff-cloud__puff ff-cloud__puff--3" />
      </div>
    </div>
  )
}

function Tree({ x, y, size }) {
  return (
    <div className="ff-tree" style={{ left: `${x}%`, top: `${y}%`, transform: `scale(${size})`, transformOrigin: 'bottom center' }}>
      <div className="ff-tree__top" />
      <div className="ff-tree__trunk" />
    </div>
  )
}

function MissionNode({ mission, index, onClick, isSelected }) {
  return (
    <div className="ff-node-wrap" style={{ left: `${mission.x}%`, top: `${mission.y}%` }}>
      {/* Difficulty badge */}
      {!mission.locked && mission.difficulty && (
        <div className="ff-diff-badge" style={{ '--diff': mission.diffColor }}>
          {mission.difficulty}
        </div>
      )}

      {/* Active tooltip */}
      {isSelected && mission.tooltip && (
        <div className="ff-node-tooltip">
          <span className="ff-node-tooltip__text">{mission.tooltip}</span>
          <span className="ff-node-tooltip__emoji">🍕</span>
          <StarRating stars={mission.stars} maxStars={mission.maxStars} size="sm" />
        </div>
      )}

      {/* Node circle */}
      <button
        className={`ff-node ${mission.locked ? 'ff-node--locked' : 'ff-node--unlocked'} ${isSelected ? 'ff-node--active' : ''}`}
        onClick={() => onClick(mission)}
        disabled={mission.locked}
        aria-label={mission.name}
      >
        {mission.locked
          ? <span className="ff-node__lock">🔒</span>
          : <span className="ff-node__num">{index + 1}</span>
        }
      </button>

      {/* Label */}
      <div className="ff-node__label">{mission.name}</div>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────── */
export default function FoodForestPage() {
  const navigate = useNavigate()
  const [selectedMission, setSelectedMission] = useState(MISSIONS[0])

  const MISSION_ROUTES = {
    'breakfast-trouble': '/adventure/food-forest/breakfast-trouble',
    'fruit-hunt':        '/adventure/food-forest/fruit-hunt/play',
    'lunch-time':        '/adventure/food-forest/lunch-time/play',
    'buddys-restaurant': '/adventure/food-forest/buddys-restaurant/play',
  }

  const handleMissionClick = (mission) => {
    if (!mission.locked) {
      const route = MISSION_ROUTES[mission.id]
      if (route) {
        navigate(route)
      } else {
        setSelectedMission((prev) => (prev?.id === mission.id ? null : mission))
      }
    }
  }

  const completedCount = MISSIONS.filter((m) => !m.locked).length
  const totalCount = MISSIONS.length

  return (
    <div className="ff-page">

      {/* ══════════════════════════════════════════
          DIV 1 — Breadcrumb + World header
      ══════════════════════════════════════════ */}
      <div className="ff-header-section">
        <div className="ff-breadcrumb-row">
          <button className="ff-back-btn" onClick={() => navigate('/adventure')} aria-label="Back to worlds">
            ← Worlds
          </button>
          <div className="ff-world-info">
            <span className="ff-world-icon">🍎</span>
            <div>
              <h1 className="ff-world-title">Food Forest</h1>
              <p className="ff-world-sub">Help Buddy open his dream restaurant!</p>
            </div>
          </div>
          <div className="ff-adventure-count">
            <span className="ff-adventure-label">{completedCount} / {totalCount} Adventures</span>
            <StarRating stars={2} maxStars={5} />
          </div>
        </div>

        {/* ══════════════════════════════════════════
            DIV 2 — Buddy's Dream story card
        ══════════════════════════════════════════ */}
        <div className="ff-story-card">
          <div className="ff-story-card__avatar">😊</div>
          <div className="ff-story-card__body">
            <p className="ff-story-card__title">
              Buddy&apos;s Dream <span className="ff-star-icon">⭐</span>
            </p>
            <p className="ff-story-card__text">
              Buddy wants to open a restaurant in Food Forest! But first he needs to learn all
              about food. <span className="ff-highlight">Help him</span> on this tasty adventure!
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          DIV 3 — Map canvas (platformer style)
      ══════════════════════════════════════════ */}
      <div className="ff-map-section">
        {/* Sky layer */}
        <div className="ff-sky">
          {/* Sun */}
          <div className="ff-sun">☀️</div>
          {/* Clouds */}
          {CLOUDS.map((c, i) => <Cloud key={i} {...c} />)}
        </div>

        {/* Ground layer */}
        <div className="ff-ground">
          {/* Trees */}
          {TREES.map((t, i) => <Tree key={i} {...t} />)}

          {/* Fruit decorations */}
          {FRUITS.map((f, i) => (
            <div key={i} className="ff-fruit" style={{ left: `${f.x}%`, top: `${f.y}%` }}>
              {f.icon}
            </div>
          ))}

          {/* Path line SVG */}
          <svg className="ff-path-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {MISSIONS.slice(0, -1).map((m, i) => {
              const next = MISSIONS[i + 1]
              return (
                <line
                  key={m.id}
                  x1={`${m.x}%`} y1={`${m.y}%`}
                  x2={`${next.x}%`} y2={`${next.y}%`}
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="0.8"
                  strokeDasharray="2.5,2"
                  strokeLinecap="round"
                />
              )
            })}
          </svg>

          {/* Mission nodes */}
          {MISSIONS.map((mission, i) => (
            <MissionNode
              key={mission.id}
              mission={mission}
              index={i}
              onClick={handleMissionClick}
              isSelected={selectedMission?.id === mission.id}
            />
          ))}
        </div>
      </div>

    </div>
  )
}
