import { useState, useMemo } from 'react'

/**
 * useVocabularyFilters – Manages filter/search/tab state for the vocabulary gallery.
 * Returns the filtered list and UI callbacks.
 */
export default function useVocabularyFilters(allData) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTab, setSelectedTab] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Extract unique categories from the data
  const categories = useMemo(() => {
    const cats = new Map()
    allData.forEach((v) => {
      if (v.categoryName && !cats.has(v.categoryId)) {
        cats.set(v.categoryId, v.categoryName)
      }
    })
    return Array.from(cats.entries()).map(([id, name]) => ({ id, name }))
  }, [allData])

  // Compute filtered list
  const filteredData = useMemo(() => {
    let list = [...allData]

    // Filter by tab
    if (selectedTab === 'learned') {
      list = list.filter((v) => v.isLearned)
    } else if (selectedTab === 'locked') {
      list = list.filter((v) => !v.isLearned)
    }

    // Filter by category
    if (selectedCategory) {
      list = list.filter((v) => v.categoryId === selectedCategory)
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      list = list.filter(
        (v) =>
          v.word?.toLowerCase().includes(term) ||
          v.meaning?.toLowerCase().includes(term) ||
          v.categoryName?.toLowerCase().includes(term)
      )
    }

    return list
  }, [allData, selectedTab, selectedCategory, searchTerm])

  // Stats
  const stats = useMemo(() => ({
    total: allData.length,
    learned: allData.filter((v) => v.isLearned).length,
    locked: allData.filter((v) => !v.isLearned).length,
  }), [allData])

  return {
    searchTerm,
    setSearchTerm,
    selectedTab,
    setSelectedTab,
    selectedCategory,
    setSelectedCategory,
    categories,
    filteredData,
    stats,
  }
}
