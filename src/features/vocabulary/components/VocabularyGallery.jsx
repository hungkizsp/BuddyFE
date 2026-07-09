import VocabularyCard from './VocabularyCard'
import SkeletonCard from '../../../shared/components/ui/SkeletonCard'

/**
 * VocabularyGallery – Responsive grid of vocabulary cards.
 */
export default function VocabularyGallery({ items, loading, error, onCardClick }) {
  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <span className="text-5xl">😵</span>
        <p className="font-grotesk text-xl text-cream/70 uppercase">Something went wrong</p>
        <p className="font-mono text-sm text-cream/40">{error}</p>
      </div>
    )
  }

  // Empty state
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <span className="text-5xl animate-float">📚</span>
        <p className="font-grotesk text-xl text-cream/70 uppercase">No words found</p>
        <p className="font-mono text-sm text-cream/40">
          Try a different filter or start an adventure to unlock vocabulary!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((vocab) => (
        <VocabularyCard
          key={vocab.id}
          vocab={vocab}
          onClick={onCardClick}
        />
      ))}
    </div>
  )
}
