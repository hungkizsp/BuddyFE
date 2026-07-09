/**
 * Tabs – Horizontal tab list with active glow styling.
 */
export default function Tabs({ items, active, onChange, className = '' }) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          className={`
            px-4 py-2 rounded-xl font-mono text-sm font-bold uppercase tracking-wider
            transition-all duration-200 border
            ${active === item.key
              ? 'bg-primary/20 text-primary border-primary/30 shadow-glow'
              : 'bg-white/[0.03] text-cream/50 border-white/5 hover:bg-white/[0.06] hover:text-cream/80'
            }
          `}
        >
          {item.label}
          {item.count != null && (
            <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${
              active === item.key ? 'bg-primary/30' : 'bg-white/10'
            }`}>
              {item.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
