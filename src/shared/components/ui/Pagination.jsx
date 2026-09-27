import React from 'react'

/**
 * Pagination – Reusable pagination component matching the app's dark neon aesthetic.
 */
export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 8,
  onPageChange,
  className = '',
}) {
  if (totalPages <= 1 && totalItems <= itemsPerPage) {
    return null
  }

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  // Generate page numbers to display with smart ellipsis
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push('...')
        pages.push(totalPages)
      }
    }
    return pages
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-slate-800/80 ${className}`}>
      {/* Items counter */}
      <div className="font-mono text-xs text-cream/50">
        Hiển thị <span className="text-primary font-bold">{startItem} - {endItem}</span> trên tổng số <span className="text-cream font-bold">{totalItems}</span> từ vựng
      </div>

      {/* Page controls */}
      <div className="flex items-center gap-1.5 select-none">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="
            px-3 py-1.5 rounded-xl font-mono text-xs font-bold
            transition-all duration-200 border
            disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent
            bg-slate-900/60 border-slate-800 text-cream/70 hover:border-slate-700 hover:text-cream hover:bg-slate-800/40
            flex items-center gap-1
          "
          aria-label="Trang trước"
        >
          <span>‹</span> Trước
        </button>

        {/* Page buttons */}
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-8 h-8 flex items-center justify-center font-mono text-xs text-cream/40"
              >
                ...
              </span>
            )
          }

          const isActive = currentPage === page
          return (
            <button
              key={`page-${page}`}
              onClick={() => onPageChange(page)}
              className={`
                w-8 h-8 rounded-xl font-mono text-xs font-bold
                transition-all duration-200 border flex items-center justify-center
                ${isActive
                  ? 'bg-primary text-slate-950 border-primary font-extrabold shadow-glow'
                  : 'bg-slate-900/60 border-slate-800 text-cream/70 hover:border-slate-700 hover:text-cream hover:bg-slate-800/40'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </button>
          )
        })}

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="
            px-3 py-1.5 rounded-xl font-mono text-xs font-bold
            transition-all duration-200 border
            disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent
            bg-slate-900/60 border-slate-800 text-cream/70 hover:border-slate-700 hover:text-cream hover:bg-slate-800/40
            flex items-center gap-1
          "
          aria-label="Trang sau"
        >
          Sau <span>›</span>
        </button>
      </div>
    </div>
  )
}
