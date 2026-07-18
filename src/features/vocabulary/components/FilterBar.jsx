import SearchBar from '../../../shared/components/ui/SearchBar'
import Tabs from '../../../shared/components/ui/Tabs'

/**
 * FilterBar – Search input, tabs, and category dropdown for vocabulary filtering.
 */
export default function FilterBar({
  searchTerm,
  onSearch,
  selectedTab,
  onTabChange,
  categories,
  selectedCategory,
  onCategoryChange,
  stats,
}) {
  const tabItems = [
    { key: 'all',     label: 'All',     count: stats.total },
    { key: 'learned', label: 'Learned', count: stats.learned },
    { key: 'locked',  label: 'Locked',  count: stats.locked },
  ]

  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Top row: Search + Category */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          placeholder="Search words..."
          onSearch={onSearch}
          className="flex-1 max-w-md"
        />

        {/* Category dropdown */}
        <select
          value={selectedCategory || ''}
          onChange={(e) => onCategoryChange(e.target.value ? Number(e.target.value) : null)}
          className="
            px-4 py-2.5 rounded-xl
            glass-simple border border-white/10
            bg-white/[0.03] text-cream
            font-mono text-sm
            outline-none cursor-pointer
            transition-all duration-200
            focus:border-primary/40 focus:shadow-glow
            appearance-none
          "
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239CA3AF' stroke-width='2' fill='none'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            paddingRight: '36px',
          }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Bottom row: Tabs */}
      <Tabs
        items={tabItems}
        active={selectedTab}
        onChange={onTabChange}
      />
    </div>
  )
}
