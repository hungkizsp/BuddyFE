import { useState, useCallback } from 'react'

/**
 * SearchBar – Debounced search input with glass styling.
 */
export default function SearchBar({ placeholder = 'Search...', onSearch, delay = 400, className = '' }) {
  const [value, setValue] = useState('')

  const debounce = useCallback((fn, ms) => {
    let timer
    return (...args) => {
      clearTimeout(timer)
      timer = setTimeout(() => fn(...args), ms)
    }
  }, [])

  const debouncedSearch = useCallback(
    debounce((term) => onSearch?.(term), delay),
    [onSearch, delay]
  )

  const handleChange = (e) => {
    const v = e.target.value
    setValue(v)
    debouncedSearch(v)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Search icon */}
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/30 text-sm pointer-events-none">
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="
          w-full pl-10 pr-4 py-2.5
          rounded-xl glass-simple
          border border-white/10
          bg-white/[0.03] text-cream
          font-mono text-sm
          placeholder:text-cream/25
          outline-none
          transition-all duration-200
          focus:border-primary/40 focus:bg-white/[0.06]
          focus:shadow-glow
        "
      />
    </div>
  )
}
