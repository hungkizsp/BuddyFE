import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore'
import useVocabulary from '../hooks/useVocabulary'
import useVocabularyFilters from '../hooks/useVocabularyFilters'
import PageShell from '../../../shared/components/ui/PageShell'
import SectionHeader from '../../../shared/components/ui/SectionHeader'
import StatPill from '../../../shared/components/ui/StatPill'
import FilterBar from '../components/FilterBar'
import VocabularyGallery from '../components/VocabularyGallery'
import VocabularyDetailDrawer from '../components/VocabularyDetailDrawer'
import TopBar from '../../../shared/components/TopBar'

export default function VocabularyPage() {
  const navigate = useNavigate()
  const { childProfile } = useAuthStore()
  const childId = childProfile?.id

  // Fetch vocabulary data
  const { data, loading, error } = useVocabulary(childId)

  // Filters
  const {
    searchTerm,
    setSearchTerm,
    selectedTab,
    setSelectedTab,
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredData,
    stats,
  } = useVocabularyFilters(data)

  // Drawer state
  const [selectedVocab, setSelectedVocab] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleCardClick = (vocab) => {
    setSelectedVocab(vocab)
    setDrawerOpen(true)
  }

  return (
    <PageShell>
      {/* TopBar */}
      <TopBar theme="dark" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-8">
        {/* Header */}
        <SectionHeader
          title="📚 Vocabulary Gallery"
          subtitle="Your collection of words learned through adventures. Click any card to see details, hear pronunciation, and track your progress."
          action={
            <div className="flex gap-3">
              <StatPill icon="📖" value={stats.learned} label="Learned" color="green" />
              <StatPill icon="🔒" value={stats.locked} label="Locked" color="coral" />
            </div>
          }
        />

        {/* Filters */}
        <FilterBar
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          stats={stats}
        />

        {/* Gallery Grid */}
        <VocabularyGallery
          items={filteredData}
          loading={loading}
          error={error}
          onCardClick={handleCardClick}
        />

        {/* Back link */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/home')}
            className="font-mono text-sm text-cream/40 hover:text-primary transition-colors uppercase"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Detail Drawer */}
      <VocabularyDetailDrawer
        vocab={selectedVocab}
        childId={childId}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </PageShell>
  )
}
