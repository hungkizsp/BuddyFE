import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/BreakfastTroublePage.css'

/* ─── Slide data ─────────────────────────────────────────── */
const SLIDES = [
  {
    id: 1,
    emoji: '😴',
    zzz: true,
    text: 'Yaaawn! Good morning…\nOh no! 😱',
  },
  {
    id: 2,
    emoji: '😋',
    zzz: false,
    text: "My stomach is making funny noises!\nGrowl growl growl!\nI'm SO hungry! 😋",
  },
  {
    id: 3,
    emoji: '🥺',
    zzz: false,
    text: 'Can you help me find breakfast?\nI really need your help, best friend! 🙏',
  },
]

export default function BreakfastTroublePage() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)

  const slide   = SLIDES[current]
  const isLast  = current === SLIDES.length - 1   // slide thứ 3

  /* Tap bất kỳ đâu → advance. Lần 3 → vào game luôn */
  const handleTap = () => {
    if (isLast) {
      navigate('/adventure/food-forest/breakfast-trouble/play')
    } else {
      setCurrent((prev) => prev + 1)
    }
  }

  return (
    <div
      className="bt-page bt-page--tappable"
      onClick={handleTap}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? handleTap() : null}
      aria-label="Tap to continue"
    >

      {/* ══════════════════════════════════════════
          Adventure label tag
      ══════════════════════════════════════════ */}
      <div className="bt-label">
        <span className="bt-label__icon">🔍</span>
        <span>Adventure 1 – Breakfast Trouble</span>
      </div>

      {/* ══════════════════════════════════════════
          Character stage
      ══════════════════════════════════════════ */}
      <div className="bt-stage">
        {/* Speech bubble */}
        <div className="bt-bubble">
          <p>Time for an<br />adventure?<br />Let&apos;s go!</p>
          <span className="bt-bubble__icon">📖</span>
        </div>

        {/* Character */}
        <div className={`bt-character bt-character--${slide.id}`}>
          {slide.zzz && <div className="bt-zzz">Z z z</div>}
          <div className="bt-emoji">{slide.emoji}</div>
          <div className="bt-bowl" />
        </div>
      </div>

      {/* Dot indicators */}
      <div className="bt-dots">
        {SLIDES.map((_, i) => (
          <span
            key={i}
            className={`bt-dot ${i === current ? 'bt-dot--active' : ''}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ══════════════════════════════════════════
          Text card
      ══════════════════════════════════════════ */}
      <div className="bt-textcard" key={current}>
        {slide.text.split('\n').map((line, i) => (
          <p key={i} className="bt-textcard__line">{line}</p>
        ))}
      </div>

      {/* Tap CTA button */}
      <div className={`bt-tap-btn ${isLast ? 'bt-tap-btn--last' : ''}`}>
        <span className="bt-tap-btn__icon">{isLast ? '🍳' : '👆'}</span>
        <span className="bt-tap-btn__text">
          {isLast ? 'Let\'s Start!' : 'Tap to continue'}
        </span>
        <span className="bt-tap-btn__arrow">{isLast ? '🚀' : '→'}</span>
      </div>

      {/* Back link — stop propagation so it doesn't advance slide */}
      <button
        className="bt-back-link"
        onClick={(e) => { e.stopPropagation(); navigate('/adventure/food-forest') }}
      >
        ← Back to map
      </button>

    </div>
  )
}

