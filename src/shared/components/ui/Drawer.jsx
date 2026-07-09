import { useEffect } from 'react'

/**
 * Drawer – Slide-out panel from the right side.
 */
export default function Drawer({ open, onClose, title, children, className = '' }) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose?.() }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  // Prevent body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`
        absolute inset-y-0 right-0 w-full max-w-md
        glass-simple border-l border-white/10
        bg-[#0a1231]/90 backdrop-blur-xl
        flex flex-col
        animate-slide-right
        ${className}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="font-grotesk text-lg font-bold uppercase text-cream tracking-wide">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10
                       flex items-center justify-center text-cream/60
                       hover:bg-white/10 hover:text-cream transition-all"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  )
}
