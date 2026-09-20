import { useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useNavigate } from 'react-router-dom'
import useScenarios from '../hooks/useScenarios'
import useWorlds from '../hooks/useWorlds'
import Button from '../../../shared/components/ui/Button'
import BollyModel from '../../../shared/components/BollyModel'
import MissionHeader from '../components/MissionHeader'
import MissionCarousel from '../components/MissionCarousel'
import '../styles/FoodForestPage.css'
import background from '../../../assets/BACKGROUND.png'
import BackgroundMusic from '../components/BackgroundMusic'
import bgMusicBoss from '../../../assets/Music/After_the_Boss_Fight.mp3'
import bgMusicKitchen from '../../../assets/Music/Kitchen_Floor_Carnival.mp3'
import learningService from '../services/learningService'
import { useAuthStore } from '../../auth/store/authStore'

export default function FoodForestPage() {
  const navigate = useNavigate()
  const { worlds, loading: worldsLoading, error: worldsError } = useWorlds()
  const { childProfile } = useAuthStore()

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
  // completedIds: set of scenario IDs (numbers) that are COMPLETED in the backend
  const [completedIds, setCompletedIds] = useState([])

  // Load completed scenario IDs from backend on mount
  useEffect(() => {
    if (!childProfile?.id) return
    let cancelled = false
    const load = async () => {
      try {
        const list = await learningService.getScenarioProgressByChildId(childProfile.id)
        if (cancelled) return
        const ids = (list || [])
          .filter((p) => p.status === 'COMPLETED')
          .map((p) => p.scenarioId ?? p.scenario?.id)
          .filter(Boolean)
        setCompletedIds(ids)
      } catch {
        // silently ignore — not critical
      }
    }
    load()
    return () => { cancelled = true }
  }, [childProfile])

  // Re-check completed when the tab regains focus (user returns from a scenario)
  useEffect(() => {
    if (!childProfile?.id) return
    const onFocus = () => {
      learningService.getScenarioProgressByChildId(childProfile.id)
        .then((list) => {
          const ids = (list || [])
            .filter((p) => p.status === 'COMPLETED')
            .map((p) => p.scenarioId ?? p.scenario?.id)
            .filter(Boolean)
          setCompletedIds(ids)
        })
        .catch(() => {})
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [childProfile])

  const getScenarioPath = (title) => {
    if (!title) return '/adventure/food-forest/kitchen-adventure'
    const t = title.toLowerCase()
    if (t.includes('breakfast')) return '/adventure/food-forest/breakfast-trouble'
    if (t.includes('supermarket') || t.includes('mua sắm') || t.includes('siêu thị'))
      return '/adventure/food-forest/supermarket-shopping'
    if (t.includes('restaurant') || t.includes('nhà hàng'))
      return '/adventure/food-forest/family-restaurant'
    return '/adventure/food-forest/kitchen-adventure'
  }

  const handleMissionClick = (mission) => {
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

  const getMusicForMission = (title) => {
    if (!title) return bgMusicBoss
    if (title.toLowerCase().includes('restaurant') || title.toLowerCase().includes('nhà hàng'))
      return bgMusicKitchen
    return bgMusicBoss
  }

  const selectedMusicSrc = getMusicForMission(selectedMission?.name);

  return (
    <div className="ff-page app-shell" style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <BackgroundMusic src={selectedMusicSrc} volume={0.2} />
      <div className="canvas-container">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 40 }}
          gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
          shadows
        >
          <ambientLight intensity={1.4} color="#fffbf0" />
          <directionalLight position={[6, 8, 4]} intensity={1.8} color="#fff2d1" castShadow />
          <directionalLight position={[-6, 2, 2]} intensity={0.6} color="#e0f2fe" />
          <BollyModel position={[-1.6, -1.0, 1.0]} scale={[0.45, 0.45, 0.35]} />
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
          Quay Lại
        </Button>

        {loading ? (
          <div className="ff-loading">Đang tải cuộc phiêu lưu...</div>
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
                  Bắt Đầu Phiêu Lưu
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
