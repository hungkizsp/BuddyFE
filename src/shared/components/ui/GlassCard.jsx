/**
 * GlassCard – Reusable glassmorphic container.
 * Applies the dark glass effect consistently across all pages.
 */
export default function GlassCard({ children, className = '', onClick, hover = false, ...props }) {
  return (
    <div
      className={`
        glass-simple rounded-2xl transition-all duration-300
        ${hover ? 'hover:bg-white/[0.06] hover:scale-[1.02] hover:shadow-glow cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}
