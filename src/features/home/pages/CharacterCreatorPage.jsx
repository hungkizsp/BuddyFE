import { useState, useEffect, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import DynamicBuddyModel from '../../../shared/components/DynamicBuddyModel'
import { useCharacterGeneration } from '../hooks/useCharacterGeneration'
import { getMyCharacters } from '../../../shared/api/characterApi'
import { useAuthStore } from '../../auth/store/authStore'
import axiosClient from '../../../shared/api/axiosClient'
import './CharacterCreatorPage.css'

const ART_STYLES = [
  { id: 'cartoon',   label: 'Cartoon',   icon: '🎨' },
  { id: 'low-poly',  label: 'Low Poly',  icon: '🔷' },
  { id: 'realistic', label: 'Realistic', icon: '📷' },
  { id: 'anime',     label: 'Anime',     icon: '⛩️' },
  { id: 'voxel',     label: 'Voxel',     icon: '🧱' },
]

const QUICK_PROMPTS = [
  'A cute baby dragon with sparkly wings',
  'A magical forest fox with glowing tail',
  'A tiny robot puppy with neon eyes',
  'A cheerful space astronaut cat',
  'A friendly wizard owl with a star hat',
  'A brave little knight with a golden shield',
]

function StatusBadge({ status }) {
  const label = status?.replace('_', ' ') ?? 'idle'
  return (
    <span className={`character-creator__status-badge status-badge--${status?.toLowerCase() ?? 'idle'}`}>
      {label}
    </span>
  )
}

export default function CharacterCreatorPage() {
  const navigate = useNavigate()
  const { task, isGenerating, error, generate, reset } = useCharacterGeneration()
  const { childProfile, loadChildProfile } = useAuthStore()

  const [prompt, setPrompt] = useState('')
  const [artStyle, setArtStyle] = useState('cartoon')
  const [characterName, setCharacterName] = useState('')
  const [myCharacters, setMyCharacters] = useState([])
  const [selectedModel, setSelectedModel] = useState(null)
  const [isEquipping, setIsEquipping] = useState(false)

  // Load existing characters on mount
  useEffect(() => {
    getMyCharacters()
      .then(setMyCharacters)
      .catch(console.error)
  }, [])

  // Refresh gallery when a task finishes
  useEffect(() => {
    if (task?.status === 'SUCCEEDED') {
      getMyCharacters().then(setMyCharacters).catch(console.error)
      setSelectedModel(task.localModelPath)
    }
  }, [task?.status])

  const handleGenerate = () => {
    if (!prompt.trim()) return
    generate(prompt.trim(), artStyle, characterName.trim() || 'My Buddy')
  }

  const handleChipClick = (chip) => {
    setPrompt(chip)
  }

  const handleGallerySelect = (character) => {
    if (character.status === 'SUCCEEDED' && character.localModelPath) {
      setSelectedModel(character.localModelPath)
    }
  }

  const handleEquip = async () => {
    if (!selectedModel || isEquipping) return
    setIsEquipping(true)
    try {
      await axiosClient.put('/profile/child', {
        activeCustomCharacterUrl: selectedModel
      })
      await loadChildProfile()
    } catch (err) {
      console.error('Failed to equip character:', err)
    } finally {
      setIsEquipping(false)
    }
  }

  const isIdle = !isGenerating && !task

  return (
    <div className="character-creator">
      {/* Ambient background blobs */}
      <div className="character-creator__bg-blob character-creator__bg-blob--purple" />
      <div className="character-creator__bg-blob character-creator__bg-blob--blue" />
      <div className="noise-overlay" />

      {/* ── Header ── */}
      <header className="character-creator__header">
        <button className="character-creator__back-btn" onClick={() => navigate('/home')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Home
        </button>
        <div className="character-creator__title-wrap">
          <div className="character-creator__title">Character Creator</div>
          <div className="character-creator__subtitle">Design your personal Buddy with AI</div>
        </div>
        <div style={{ width: 120 }} />
      </header>

      {/* ── Main Body ── */}
      <div className="character-creator__body">

        {/* ── LEFT: Form Panel ── */}
        <div className="character-creator__form-panel">

          {/* Character Name */}
          <div>
            <div className="form-section-label">01 — Character Name</div>
            <input
              type="text"
              className="character-creator__name-input"
              placeholder="E.g. Spark, Luna, Rex..."
              value={characterName}
              onChange={e => setCharacterName(e.target.value)}
              maxLength={50}
            />
          </div>

          {/* Prompt */}
          <div>
            <div className="form-section-label">02 — Describe your character</div>
            <textarea
              className="character-creator__prompt-input"
              placeholder="A tiny dragon with golden scales, big friendly eyes, wearing a school backpack..."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              maxLength={500}
            />
          </div>

          {/* Quick Prompts */}
          <div>
            <div className="form-section-label">03 — Quick ideas</div>
            <div className="character-creator__chips">
              {QUICK_PROMPTS.map(q => (
                <button
                  key={q}
                  className={`character-creator__chip ${prompt === q ? 'character-creator__chip--active' : ''}`}
                  onClick={() => handleChipClick(q)}
                >
                  {q.split(' ').slice(0, 4).join(' ')}...
                </button>
              ))}
            </div>
          </div>

          {/* Art Style */}
          <div>
            <div className="form-section-label">04 — Art Style</div>
            <div className="character-creator__art-styles">
              {ART_STYLES.map(style => (
                <button
                  key={style.id}
                  className={`art-style-card ${artStyle === style.id ? 'art-style-card--active' : ''}`}
                  onClick={() => setArtStyle(style.id)}
                >
                  <span className="art-style-card__icon">{style.icon}</span>
                  <span className="art-style-card__name">{style.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ color: '#FF4A5A', fontFamily: 'JetBrains Mono', fontSize: '0.75rem', background: 'rgba(255,74,90,0.07)', border: '1px solid rgba(255,74,90,0.2)', borderRadius: '0.5rem', padding: '0.75rem 1rem' }}>
              ⚠ {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            className="character-creator__generate-btn"
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating
              ? `✦ Generating... ${task?.progress ?? 0}%`
              : '✦ Generate My Character'
            }
          </button>

          {task && (
            <button
              onClick={reset}
              style={{ background: 'none', border: 'none', color: 'rgba(243,244,246,0.4)', fontFamily: 'JetBrains Mono', fontSize: '0.7rem', textTransform: 'uppercase', cursor: 'pointer', letterSpacing: '0.05em' }}
            >
              ✕ Start over
            </button>
          )}
        </div>

        {/* ── RIGHT: Preview Panel ── */}
        <div className="character-creator__preview-panel">

          {/* 3D Canvas Stage */}
          <div className="character-creator__canvas-stage">
            {selectedModel ? (
              <Canvas camera={{ position: [0, 1, 5], fov: 45 }} style={{ width: '100%', height: '100%' }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 10, 5]} intensity={1.2} />
                <pointLight position={[-5, 5, -5]} intensity={0.5} color="#b724ff" />
                <Suspense fallback={null}>
                  <DynamicBuddyModel modelPath={selectedModel} scale={1.8} position={[0, -1, 0]} />
                  <Environment preset="night" />
                </Suspense>
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
              </Canvas>
            ) : (
              <div className="character-creator__placeholder">
                <span className="character-creator__placeholder-icon">🐾</span>
                <p className="character-creator__placeholder-text">
                  Your character will appear here after generation
                </p>
              </div>
            )}
          </div>

          {selectedModel && (
            <button
              onClick={handleEquip}
              disabled={isEquipping || childProfile?.activeCustomCharacterUrl === selectedModel}
              style={{
                width: '100%',
                padding: '0.85rem',
                border: 'none',
                borderRadius: '999px',
                background: childProfile?.activeCustomCharacterUrl === selectedModel
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'linear-gradient(135deg, #b724ff, #8833ff)',
                color: childProfile?.activeCustomCharacterUrl === selectedModel ? 'rgba(255,255,255,0.4)' : '#fff',
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                cursor: childProfile?.activeCustomCharacterUrl === selectedModel ? 'default' : 'pointer',
                transition: 'all 0.2s',
                border: childProfile?.activeCustomCharacterUrl === selectedModel ? '1px solid rgba(255,255,255,0.1)' : 'none',
                boxShadow: childProfile?.activeCustomCharacterUrl === selectedModel ? 'none' : '0 4px 16px rgba(136, 51, 255, 0.25)'
              }}
            >
              {childProfile?.activeCustomCharacterUrl === selectedModel
                ? '⭐ Equipped as Active Buddy'
                : isEquipping
                  ? 'Equipping...'
                  : 'Equip Character'
              }
            </button>
          )}

          {/* Task Status */}
          {task && (
            <div className="character-creator__status">
              <div className="character-creator__status-header">
                <span className="character-creator__status-label">Generation Status</span>
                <StatusBadge status={task.status} />
              </div>
              <div className="character-creator__progress-bar-track">
                <div
                  className="character-creator__progress-bar-fill"
                  style={{ width: `${task.progress ?? 0}%` }}
                />
              </div>
              <div className="character-creator__progress-text">
                {task.status === 'SUCCEEDED'
                  ? '✓ Complete — model saved locally'
                  : task.status === 'FAILED'
                    ? '✕ Generation failed'
                    : `Meshy AI is sculpting your character... ${task.progress ?? 0}%`
                }
              </div>
            </div>
          )}

          {/* Info Card when idle */}
          {isIdle && !selectedModel && (
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(243,244,246,0.35)', lineHeight: 1.8, padding: '0 0.25rem' }}>
              <p>↑ Describe your character on the left and click Generate.</p>
              <p style={{ marginTop: '0.5rem' }}>Generation takes approximately 1–3 minutes using Meshy AI.</p>
              <p style={{ marginTop: '0.5rem' }}>The 3D model will be saved to your local project automatically.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── My Characters Gallery ── */}
      {myCharacters.length > 0 && (
        <div className="character-creator__gallery">
          <div className="character-creator__gallery-title">
            My Characters <span style={{ fontSize: '0.75rem', color: 'rgba(243,244,246,0.4)', fontFamily: 'JetBrains Mono', textTransform: 'none', letterSpacing: 0 }}>({myCharacters.length})</span>
          </div>
          <div className="character-creator__gallery-grid">
            {myCharacters.map(character => (
              <div
                key={character.id}
                className="gallery-card"
                onClick={() => handleGallerySelect(character)}
              >
                <div className="gallery-card__thumb">
                  {character.thumbnailUrl
                    ? <img src={character.thumbnailUrl} alt={character.characterName} />
                    : <span>{character.status === 'SUCCEEDED' ? '🐾' : '⏳'}</span>
                  }
                </div>
                <div className="gallery-card__name">{character.characterName}</div>
                <div className="gallery-card__style">
                  <span className={`gallery-card__status-dot dot--${character.status?.toLowerCase()}`} />
                  {character.artStyle}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
