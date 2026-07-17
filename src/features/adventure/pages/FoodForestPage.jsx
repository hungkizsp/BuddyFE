import { useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useNavigate } from 'react-router-dom'
import useScenarios from '../hooks/useScenarios'
import useWorlds from '../hooks/useWorlds'
import Button from '../../../shared/components/ui/Button'
import BuddyModel from '../../../shared/components/BuddyModel'
import MissionHeader from '../components/MissionHeader'
import MissionCarousel from '../components/MissionCarousel'
import '../styles/FoodForestPage.css'
import background from '../../../assets/BACKGROUND.png'

export default function FoodForestPage() {
  const navigate = useNavigate()
  const { worlds, loading: worldsLoading, error: worldsError } = useWorlds()

  const foodForest = useMemo(
    () => worlds.find((world) => world.name?.toLowerCase() === 'food forest') || worlds[0],
    [worlds],
  )

  const { scenarios, loading: scenariosLoading, error: scenariosError } = useScenarios(foodForest?.id)

  const missions = useMemo(
    () => scenarios.map((scenario) => ({
      id: scenario.id,
      name: scenario.title,
      tooltip: scenario.description,
      difficulty: scenario.difficulty,
      scenario,
    })),
    [scenarios],
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [completedIds, setCompletedIds] = useState([])

  const getScenarioPath = (title) => {
    switch (title) {
      case 'Breakfast Trouble':
        return '/adventure/food-forest/breakfast-trouble'
      case 'Supermarket Shopping':
        return '/adventure/food-forest/supermarket-shopping'
      case 'Family Restaurant':
        return '/adventure/food-forest/family-restaurant'
      default:
        return '/adventure/food-forest/kitchen-adventure'
    }
  }

  const handleMissionClick = (mission) => {
    setCompletedIds((prev) => (prev.includes(mission.id) ? prev : [...prev, mission.id]))

    const path = getScenarioPath(mission.scenario.title)

    navigate(`${path}?scenarioId=${mission.scenario.id}`, {
      state: {
        world: foodForest,
        scenario: mission.scenario,
      },
    })
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? missions.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === missions.length - 1 ? 0 : prev + 1))
  }

  const selectedMission = missions[currentIndex] || missions[0]
  const loading = worldsLoading || scenariosLoading
  const error = worldsError || scenariosError

  return (
    <div className="ff-page app-shell" style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="canvas-container">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 40 }}
          gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
          shadows
        >
          <ambientLight intensity={1.4} color="#fffbf0" />
          <directionalLight position={[6, 8, 4]} intensity={1.8} color="#fff2d1" castShadow />
          <directionalLight position={[-6, 2, 2]} intensity={0.6} color="#e0f2fe" />
          <BuddyModel position={[-1.6, -1.5, 1.0]} scale={[0.55, 0.55, 0.55]} />
        </Canvas>
      </div>

      <div className="ff-content">
        <Button
          variant="secondary"
          className="ff-back-btn"
          onClick={() => navigate('/adventure')}
          aria-label="Back to worlds"
          type="button"
        >
          Back
        </Button>

        {loading ? (
          <div className="ff-loading">Loading adventures...</div>
        ) : error ? (
          <div className="ff-loading ff-loading--error">{error}</div>
        ) : (
          <>
            <MissionHeader
              worldName={foodForest?.name}
              missionName={selectedMission?.name}
              missionDescription={error || selectedMission?.tooltip || foodForest?.description}
            />

            <div className="ff-main-area">
              <MissionCarousel
                missions={missions}
                currentIndex={currentIndex}
                completedIds={completedIds}
                onPrev={handlePrev}
                onNext={handleNext}
              />

              <div className="ff-actions">
                <Button
                  className="ff-start-btn"
                  onClick={() => handleMissionClick(selectedMission)}
                  type="button"
                >
                  Start Adventure
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
