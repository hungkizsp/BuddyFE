import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../../../shared/components/TopBar'
import '../styles/AdventurePage.css'

/* ─── Data ──────────────────────────────────────────────── */
const WORLDS = [
  {
    id: 'home-village',
    name: 'Home Village',
    icon: '🏠',
    x: 22, y: 60,
    stars: 3, maxStars: 3,
    locked: false,
    color: '#4ade80', ringColor: '#22c55e',
  },
  {
    id: 'food-forest',
    name: 'Food Forest',
    icon: '🍎',
    x: 43, y: 35,
    stars: 2, maxStars: 3,
    locked: false,
    color: '#f87171', ringColor: '#ef4444',
  },
  {
    id: 'animal-island',
    name: 'Animal Island',
    icon: '🦁',
    x: 62, y: 52,
    stars: 2, maxStars: 3,
    locked: false,
    color: '#fbbf24', ringColor: '#f59e0b',
  },
  {
    id: 'school-city',
    name: 'School City',
    icon: '🔒',
    x: 76, y: 28,
    stars: 0, maxStars: 3,
    locked: true,
    color: '#9ca3af', ringColor: '#6b7280',
  },
  {
    id: 'space-world',
    name: 'Space World',
    icon: '🔒',
    x: 88, y: 50,
    stars: 0, maxStars: 3,
    locked: true,
    color: '#9ca3af', ringColor: '#6b7280',
  },
]

const PATHS = [
  { from: 'home-village', to: 'food-forest' },
  { from: 'food-forest', to: 'animal-island' },
  { from: 'animal-island', to: 'school-city' },
  { from: 'school-city', to: 'space-world' },
]

const CLOUDS = [
  { x: 14, y: 12, size: 1.0 },
  { x: 38, y: 8,  size: 0.75 },
  { x: 67, y: 14, size: 0.9 },
  { x: 85, y: 8,  size: 0.65 },
  { x: 55, y: 22, size: 0.6 },
]

/* ─── Small components ──────────────────────────────────── */
function StarRating({ stars, maxStars }) {
  return (
    <div className="adv-stars">
      {Array.from({ length: maxStars }).map((_, i) => (
        <span
          key={i}
          className={`adv-star ${i < stars ? 'adv-star--filled' : 'adv-star--empty'}`}
        >★</span>
      ))}
    </div>
  )
}

function Cloud({ x, y, size }) {
  return (
    <div
      className="adv-cloud"
      style={{ left: `${x}%`, top: `${y}%`, transform: `scale(${size})`, transformOrigin: 'left top' }}
    >
      <div className="adv-cloud__body">
        <div className="adv-cloud__puff adv-cloud__puff--1" />
        <div className="adv-cloud__puff adv-cloud__puff--2" />
        <div className="adv-cloud__puff adv-cloud__puff--3" />
      </div>
    </div>
  )
}

function DashedPath({ fromWorld, toWorld }) {
  return (
    <svg className="adv-path-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <line
        x1={`${fromWorld.x}%`} y1={`${fromWorld.y}%`}
        x2={`${toWorld.x}%`}  y2={`${toWorld.y}%`}
        stroke="white" strokeWidth="0.5"
        strokeDasharray="2,2" strokeLinecap="round" opacity="0.7"
      />
    </svg>
  )
}

function WorldNode({ world, onClick, isSelected }) {
  return (
    <button
      className={`adv-node ${world.locked ? 'adv-node--locked' : 'adv-node--unlocked'} ${isSelected ? 'adv-node--selected' : ''}`}
      style={{ left: `${world.x}%`, top: `${world.y}%`, '--node-color': world.color, '--node-ring': world.ringColor }}
      onClick={() => onClick(world)}
      aria-label={`${world.name}${world.locked ? ' (locked)' : ''}`}
      disabled={world.locked}
    >
      <div className="adv-node__ring" />
      <div className="adv-node__circle">
        <span className="adv-node__icon">{world.icon}</span>
      </div>
      <div className="adv-node__label">
        {world.name}
        {!world.locked && <StarRating stars={world.stars} maxStars={world.maxStars} />}
      </div>
    </button>
  )
}

function TooltipBubble({ world, onClose, onPlay }) {
  if (!world) return null
  return (
    <div className="adv-tooltip" style={{ left: `${world.x}%`, top: `${world.y}%` }}>
      <button className="adv-tooltip__close" onClick={onClose} aria-label="Close">×</button>
      <p className="adv-tooltip__title">{world.name}</p>
      <StarRating stars={world.stars} maxStars={world.maxStars} />
      <button className="adv-tooltip__play" onClick={() => onPlay(world)}>▶ Play</button>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────── */
export default function AdventurePage() {
  const navigate = useNavigate()
  const [selectedWorld, setSelectedWorld] = useState(null)

  const handleNodeClick = (world) => {
    setSelectedWorld((prev) => (prev?.id === world.id ? null : world))
  }

  const handlePlay = (world) => {
    const routes = {
      'food-forest': '/adventure/food-forest',
      'home-village': '/adventure/home-village',
      'animal-island': '/adventure/animal-island',
    }
    const route = routes[world.id]
    if (route) navigate(route)
  }

  const unlockedCount = WORLDS.filter((w) => !w.locked).length
  const lockedCount   = WORLDS.filter((w) => w.locked).length
  const worldMap      = Object.fromEntries(WORLDS.map((w) => [w.id, w]))

  return (
    <div className="adv-page">
      <TopBar theme="light" />

      {/* ══════════════════════════════════════════
          DIV 1 — Header / Title section
      ══════════════════════════════════════════ */}
      <div className="adv-header-section">
        <div>
          <h1 className="adv-title">Adventure Map</h1>
          <p className="adv-subtitle">
            {unlockedCount} worlds explored · {lockedCount} locked
          </p>
        </div>
        <div className="adv-zoom-group">
          <button className="adv-zoom-btn" aria-label="Zoom in">+</button>
          <button className="adv-zoom-btn" aria-label="Zoom out">−</button>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          DIV 2 — Map canvas section
      ══════════════════════════════════════════ */}
      <div className="adv-map-section">
        {/* Clouds */}
        {CLOUDS.map((c, i) => <Cloud key={i} {...c} />)}

        {/* Dashed paths */}
        {PATHS.map(({ from, to }) => (
          <DashedPath key={`${from}-${to}`} fromWorld={worldMap[from]} toWorld={worldMap[to]} />
        ))}

        {/* World nodes */}
        {WORLDS.map((world) => (
          <WorldNode
            key={world.id}
            world={world}
            onClick={handleNodeClick}
            isSelected={selectedWorld?.id === world.id}
          />
        ))}

        {/* Tooltip */}
        {selectedWorld && (
          <TooltipBubble
            world={selectedWorld}
            onClose={() => setSelectedWorld(null)}
            onPlay={handlePlay}
          />
        )}
      </div>

    </div>
  )
}
