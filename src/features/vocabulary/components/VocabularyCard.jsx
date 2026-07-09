import { useState, useRef } from 'react'
import Badge from '../../../shared/components/ui/Badge'

const FALLBACK_IMG = 'https://placehold.co/400x400/0f172a/6FFF00?text=🦉&font=roboto'

/**
 * VocabularyCard – Gallery card for a single vocabulary word.
 */
export default function VocabularyCard({ vocab, onClick }) {
  const [imgError, setImgError] = useState(false)
  const audioRef = useRef(null)

  const isLocked = !vocab.isLearned

  const playAudio = (e) => {
    e.stopPropagation()
    if (vocab.audioUrl) {
      if (!audioRef.current) audioRef.current = new Audio(vocab.audioUrl)
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }
  }

  // Mastery stars (0-5)
  const stars = Math.min(Math.max(vocab.masteryLevel || 0, 0), 5)

  return (
    <div
      onClick={() => onClick?.(vocab)}
      className={`
        group relative glass-simple rounded-2xl overflow-hidden
        transition-all duration-300 cursor-pointer
        hover:scale-[1.03] hover:shadow-glow hover:border-primary/30
        ${isLocked ? 'opacity-75 hover:opacity-100' : ''}
      `}
    >
      {/* Image */}
      <div className="relative w-full aspect-square bg-white/[0.02] overflow-hidden">
        <img
          src={imgError || !vocab.imageUrl ? FALLBACK_IMG : vocab.imageUrl}
          alt={vocab.word}
          onError={() => setImgError(true)}
          className={`
            w-full h-full object-cover
            transition-transform duration-500
            ${!isLocked ? 'group-hover:scale-110' : 'grayscale'}
          `}
        />

        {/* Locked overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-navy/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
            <span className="text-3xl">🔒</span>
            <span className="font-mono text-[11px] text-cream/40 uppercase">Unlock in adventure</span>
          </div>
        )}

        {/* Audio button (unlocked only) */}
        {!isLocked && vocab.audioUrl && (
          <button
            onClick={playAudio}
            className="
              absolute top-3 right-3
              w-9 h-9 rounded-full
              bg-navy/60 backdrop-blur-md border border-white/10
              flex items-center justify-center
              text-cream/70 text-sm
              opacity-0 group-hover:opacity-100
              transition-all duration-200
              hover:bg-primary/30 hover:text-primary
            "
          >
            🔊
          </button>
        )}

        {/* Category badge */}
        {vocab.categoryName && (
          <div className="absolute bottom-3 left-3">
            <Badge variant={isLocked ? 'locked' : 'primary'}>
              {vocab.categoryName}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Word */}
        <h3 className="font-grotesk text-lg font-bold uppercase text-cream tracking-wide truncate">
          {vocab.word}
        </h3>

        {/* Phonetic */}
        {vocab.phonetic && (
          <p className="font-mono text-xs text-primary/70">{vocab.phonetic}</p>
        )}

        {/* Meaning */}
        <p className="font-nunito text-sm text-cream/60 line-clamp-2">
          {vocab.meaning || '—'}
        </p>

        {/* Mastery stars (if learned) */}
        {!isLocked && (
          <div className="flex items-center gap-1 pt-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className={`text-sm transition-all duration-300 ${
                  i <= stars ? 'text-accent drop-shadow-[0_0_6px_rgba(255,184,63,0.6)]' : 'text-white/10'
                }`}
              >
                ★
              </span>
            ))}
            {vocab.confidenceScore > 0 && (
              <span className="ml-auto font-mono text-[10px] text-neon/60">
                {Math.round(vocab.confidenceScore * 100)}%
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
