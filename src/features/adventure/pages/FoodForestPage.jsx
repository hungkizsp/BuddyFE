import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useScenarios from '../hooks/useScenarios'
import useWorlds from '../hooks/useWorlds'
import '../styles/FoodForestPage.css'

const TREES = [
  { x: 10, y: 70, size: 1.0 },
  { x: 24, y: 75, size: 0.8 },
  { x: 40, y: 72, size: 1.1 },
  { x: 58, y: 68, size: 0.9 },
  { x: 62, y: 76, size: 0.7 },
  { x: 76, y: 71, size: 1.0 },
  { x: 92, y: 73, size: 0.85 },
  { x: 5, y: 66, size: 0.75 },
  { x: 97, y: 66, size: 0.7 },
]

const CLOUDS = [
  { x: 8, y: 8, size: 0.9 },
  { x: 28, y: 5, size: 0.7 },
  { x: 52, y: 10, size: 0.8 },
  { x: 72, y: 6, size: 0.65 },
  { x: 85, y: 11, size: 0.75 },
]

const NODE_POSITIONS = [
  { x: 16, y: 62 },
  { x: 33, y: 50 },
  { x: 52, y: 58 },
  { x: 69, y: 44 },
  { x: 86, y: 56 },
]

function StarRating({ stars, maxStars, size = 'md' }) {
  return (
    <div className={`ff-stars ff-stars--${size}`}>
      {Array.from({ length: maxStars }).map((_, index) => (
        <span key={index} className={`ff-star ${index < stars ? 'ff-star--filled' : 'ff-star--empty'}`}>*</span>
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
      {mission.difficulty && (
        <div className="ff-diff-badge" style={{ '--diff': mission.diffColor }}>
          {mission.difficulty}
        </div>
      )}

      {isSelected && (
        <div className="ff-node-tooltip">
          <span className="ff-node-tooltip__text">{mission.tooltip}</span>
          <StarRating stars={mission.stars} maxStars={mission.maxStars} size="sm" />
        </div>
      )}

      <button
        className={`ff-node ff-node--unlocked ${isSelected ? 'ff-node--active' : ''}`}
        onClick={() => onClick(mission)}
        aria-label={mission.name}
        type="button"
      >
        <span className="ff-node__num">{index + 1}</span>
      </button>

      <div className="ff-node__label">{mission.name}</div>
    </div>
  )
}

const difficultyColor = (difficulty = '') => {
  const value = difficulty.toLowerCase()
  if (value.includes('hard')) return '#ef4444'
  if (value.includes('medium')) return '#f59e0b'
  return '#22c55e'
}

export default function FoodForestPage() {
  const navigate = useNavigate()
  const { worlds, loading: worldsLoading, error: worldsError } = useWorlds()

  const foodForest = useMemo(
    () => worlds.find((world) => world.name?.toLowerCase() === 'food forest') || worlds[0],
    [worlds],
  )

  const { scenarios, loading: scenariosLoading, error: scenariosError } = useScenarios(foodForest?.id)
  const [selectedMissionId, setSelectedMissionId] = useState(null)

  const missions = useMemo(
    () => scenarios.map((scenario, index) => {
      const position = NODE_POSITIONS[index % NODE_POSITIONS.length]
      return {
        id: scenario.id,
        name: scenario.title,
        tooltip: scenario.description,
        difficulty: scenario.difficulty,
        diffColor: difficultyColor(scenario.difficulty),
        stars: 0,
        maxStars: 3,
        scenario,
        ...position,
      }
    }),
    [scenarios],
  )

  const handleMissionClick = (mission) => {
    setSelectedMissionId(mission.id);

    let path = "/adventure/food-forest/kitchen-adventure";

    switch (mission.scenario.title) {
      case "Supermarket Shopping":
        path = "/adventure/food-forest/supermarket-shopping";
        break;

      case "Family Restaurant":
        path = "/adventure/food-forest/family-restaurant";
        break;

      case "Breakfast Trouble":
        path = "/adventure/food-forest/kitchen-adventure";
        break;

      default:
        path = "/adventure/food-forest/kitchen-adventure";
    }

    navigate(`${path}?scenarioId=${mission.scenario.id}`, {
      state: {
        world: foodForest,
        scenario: mission.scenario,
      },
    });
  };

  const selectedMission = missions.find((mission) => mission.id === selectedMissionId) || missions[0]
  const loading = worldsLoading || scenariosLoading
  const error = worldsError || scenariosError

  return (
    <div className="ff-page">
      <div className="ff-header-section">
        <div className="ff-breadcrumb-row">
          <button className="ff-back-btn" onClick={() => navigate('/adventure')} aria-label="Back to worlds" type="button">
            Back
          </button>
          <div className="ff-world-info">
            {foodForest?.thumbnail ? <img className="ff-world-thumb" src={foodForest.thumbnail} alt={foodForest.name} /> : null}
            <div>
              <h1 className="ff-world-title">{foodForest?.name || 'Food Forest'}</h1>
              <p className="ff-world-sub">{foodForest?.description || 'Loading world...'}</p>
            </div>
          </div>
          <div className="ff-adventure-count">
            <span className="ff-adventure-label">{missions.length} Adventures</span>
            <StarRating stars={0} maxStars={5} />
          </div>
        </div>

        <div className="ff-story-card">
          <div className="ff-story-card__body">
            <p className="ff-story-card__title">{selectedMission?.name || foodForest?.name || 'Adventure'}</p>
            <p className="ff-story-card__text">
              {error || selectedMission?.tooltip || foodForest?.description || 'Choose a scenario to start learning.'}
            </p>
          </div>
        </div>
      </div>

      <div className="ff-map-section">
        <div className="ff-sky">
          <div className="ff-sun">Sun</div>
          {CLOUDS.map((cloud) => <Cloud key={`${cloud.x}-${cloud.y}`} {...cloud} />)}
        </div>

        <div className="ff-ground">
          {TREES.map((tree) => <Tree key={`${tree.x}-${tree.y}`} {...tree} />)}

          <svg className="ff-path-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {missions.slice(0, -1).map((mission, index) => {
              const next = missions[index + 1]
              return (
                <line
                  key={mission.id}
                  x1={`${mission.x}%`}
                  y1={`${mission.y}%`}
                  x2={`${next.x}%`}
                  y2={`${next.y}%`}
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="0.8"
                  strokeDasharray="2.5,2"
                  strokeLinecap="round"
                />
              )
            })}
          </svg>

          {loading ? <div className="ff-loading">Loading adventures...</div> : null}
          {!loading && missions.map((mission, index) => (
            <MissionNode
              key={mission.id}
              mission={mission}
              index={index}
              onClick={handleMissionClick}
              isSelected={selectedMission?.id === mission.id}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
