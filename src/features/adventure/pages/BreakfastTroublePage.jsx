import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../../../shared/components/ui/Button'
import '../styles/BreakfastTroublePage.css'
import breakfast1 from '../../../assets/mini-1/breakfast_1.png'
import breakfast2 from '../../../assets/mini-1/breakfast_2.png'
import breakfast3 from '../../../assets/mini-1/breakfast_3.png'

const PANELS = [
  { id: 1, image: breakfast1, alt: 'Breakfast panel 1' },
  { id: 2, image: breakfast2, alt: 'Breakfast panel 2' },
  { id: 3, image: breakfast3, alt: 'Breakfast panel 3' },
]

export default function BreakfastTroublePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const scenarioId = location.state?.scenario?.id || new URLSearchParams(location.search).get('scenarioId')
  const scenario = location.state?.scenario
  const world = location.state?.world

  const handleStart = () => {
    const qs = scenarioId ? `?scenarioId=${scenarioId}` : ''
    navigate(`/adventure/food-forest/kitchen-adventure${qs}`, {
      state: { world, scenario },
    })
  }

  return (
    <div className="bt-page app-shell">
      <div className="bt-label">
        <span className="bt-label__icon">🔍</span>
        <span>Adventure 1 – Breakfast Trouble</span>
      </div>

      <div className="bt-manga-grid">
        <img
          src={PANELS[0].image}
          alt={PANELS[0].alt}
          className="bt-manga-panel bt-manga-panel--top"
          draggable={false}
        />
        <img
          src={PANELS[1].image}
          alt={PANELS[1].alt}
          className="bt-manga-panel bt-manga-panel--top"
          draggable={false}
        />
        <img
          src={PANELS[2].image}
          alt={PANELS[2].alt}
          className="bt-manga-panel bt-manga-panel--bottom"
          draggable={false}
        />
      </div>

      <Button
        className="bt-start-btn"
        onClick={handleStart}
        type="button"
      >
        <span className="bt-start-btn__icon">🍳</span>
        <span>Let&apos;s Start!</span>
        <span className="bt-start-btn__arrow">🚀</span>
      </Button>

      <Button
        variant="secondary"
        className="bt-back-link"
        onClick={() => navigate('/adventure/food-forest')}
      >
        ← Back to map
      </Button>
    </div>
  )
}
