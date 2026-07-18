import { useRef } from 'react'
import Drawer from '../../../shared/components/ui/Drawer'
import Badge from '../../../shared/components/ui/Badge'

const FALLBACK_IMG = 'https://placehold.co/400x400/0f172a/6FFF00?text=🦉&font=roboto'

/**
 * VocabularyDetailDrawer – Slide-out panel showing full word detail.
 */
export default function VocabularyDetailDrawer({ vocab, open, onClose }) {
  const audioRef = useRef(null)

  if (!vocab) return null

  const isLocked = !vocab.isLearned
  const stars = Math.min(Math.max(vocab.masteryLevel || 0, 0), 5)
  const confidence = Math.round((vocab.confidenceScore || 0) * 100)

  const playAudio = () => {
    if (isLocked) return
    if (vocab.audioUrl) {
      if (!audioRef.current) audioRef.current = new Audio(vocab.audioUrl)
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }
  }
  return (
    <Drawer open={open} onClose={onClose} title="Chi tiết từ vựng">
      {/* Locked warning banner */}
      {isLocked && (
        <div className="mb-6 p-4 rounded-xl border border-warning/20 bg-warning/5 text-warning flex items-start gap-3">
          <span className="text-xl mt-0.5">🔒</span>
          <div className="text-left">
            <p className="text-xs font-mono uppercase tracking-wider font-bold">Từ vựng chưa mở khóa</p>
            <p className="text-xs text-cream/70 mt-0.5 leading-relaxed">
              Từ vựng này chưa được mở khóa. Hãy tham gia cuộc phiêu lưu để mở khóa âm thanh phát âm và theo dõi tiến trình nhé!
            </p>
          </div>
        </div>
      )}

      {/* Image */}
      <div className="w-full aspect-video rounded-2xl overflow-hidden bg-white/[0.02] mb-6">
        <img
          src={vocab.imageUrl || FALLBACK_IMG}
          alt={vocab.word}
          onError={(e) => { e.target.src = FALLBACK_IMG }}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Word heading + audio */}
      <div className="flex items-center gap-3 mb-2">
        <h2 className="font-grotesk text-3xl font-bold uppercase text-cream tracking-wide">
          {vocab.word}
        </h2>
        {vocab.audioUrl && (
          <button
            onClick={playAudio}
            disabled={isLocked}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all shadow-glow ${
              isLocked 
                ? 'bg-white/5 border border-white/10 text-cream/30 cursor-not-allowed'
                : 'bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 hover:scale-110'
            }`}
          >
            {isLocked ? '🔒' : '🔊'}
          </button>
        )}
      </div>

      {/* Phonetic */}
      {vocab.phonetic && (
        <p className="font-mono text-sm text-primary/70 mb-4">{vocab.phonetic}</p>
      )}

      {/* Category + Difficulty */}
      <div className="flex gap-2 mb-6">
        {vocab.categoryName && <Badge variant={isLocked ? 'locked' : 'primary'}>{vocab.categoryName}</Badge>}
        {vocab.difficulty && <Badge variant="warning">{vocab.difficulty}</Badge>}
      </div>

      {/* Meaning */}
      <div className="glass-simple rounded-xl p-4 mb-4">
        <p className="font-mono text-[11px] text-cream/40 uppercase tracking-wider mb-2">Ý nghĩa</p>
        <p className="font-nunito text-base text-cream leading-relaxed">
          {vocab.meaning || 'Không có giải nghĩa'}
        </p>
      </div>

      {/* Example Sentence */}
      {vocab.exampleSentence && (
        <div className="glass-simple rounded-xl p-4 mb-4">
          <p className="font-mono text-[11px] text-cream/40 uppercase tracking-wider mb-2">Ví dụ</p>
          <p className="font-nunito text-base text-cream/90 italic leading-relaxed">
            "{vocab.exampleSentence}"
          </p>
        </div>
      )}

      {/* Mastery & Stats */}
      {isLocked ? (
        <div className="glass-simple rounded-xl p-4 mb-4 text-center py-6">
          <span className="text-2xl block mb-2">🔒</span>
          <p className="font-grotesk text-sm font-bold uppercase text-cream/70">Chưa có tiến trình</p>
          <p className="font-mono text-[10px] text-cream/40 uppercase mt-1">Mở khóa từ vựng này trong cuộc phiêu lưu để theo dõi tiến độ</p>
        </div>
      ) : (
        <div className="glass-simple rounded-xl p-4 mb-4">
          <p className="font-mono text-[11px] text-cream/40 uppercase tracking-wider mb-3">Tiến độ học tập</p>

          {/* Stars */}
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className={`text-xl transition-all ${
                  i <= stars ? 'text-accent drop-shadow-[0_0_8px_rgba(255,184,63,0.7)]' : 'text-white/10'
                }`}
              >
                ★
              </span>
            ))}
            <span className="ml-2 font-mono text-sm text-cream/50">Cấp độ {stars}/5</span>
          </div>

          {/* Confidence bar */}
          <div className="mb-3">
            <div className="flex justify-between font-mono text-[11px] text-cream/40 mb-1">
              <span>Độ tự tin</span>
              <span className="text-neon">{confidence}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-neon to-primary transition-all duration-700"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>

          {/* Correct / Wrong counts */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-simple rounded-lg p-3 text-center">
              <p className="font-grotesk text-xl font-bold text-neon">{vocab.correctCount}</p>
              <p className="font-mono text-[10px] text-cream/40 uppercase">Đúng</p>
            </div>
            <div className="glass-simple rounded-lg p-3 text-center">
              <p className="font-grotesk text-xl font-bold text-danger">{vocab.wrongCount}</p>
              <p className="font-mono text-[10px] text-cream/40 uppercase">Sai</p>
            </div>
          </div>
        </div>
      )}

      {/* Last practiced */}
      {!isLocked && vocab.lastPracticed && (
        <p className="font-mono text-[11px] text-cream/30 text-center uppercase">
          Luyện tập gần nhất: {new Date(vocab.lastPracticed).toLocaleDateString()}
        </p>
      )}
    </Drawer>
  )
}
