/**
 * StatPill – Capsule UI for displaying stats (XP, Coins, Streak).
 */
const COLOR_MAP = {
  blue:  'border-primary/30 text-primary shadow-glow',
  gold:  'border-accent/30 text-accent shadow-glow-gold',
  coral: 'border-danger/30 text-danger shadow-glow-coral',
  green: 'border-neon/30 text-neon shadow-glow-green',
}

export default function StatPill({ icon, value, label, color = 'blue', className = '' }) {
  const colorClass = COLOR_MAP[color] || COLOR_MAP.blue

  return (
    <div className={`
      inline-flex items-center gap-2 px-4 py-2
      rounded-full glass-simple
      border ${colorClass}
      font-mono text-sm font-bold
      transition-all duration-200 hover:scale-105
      ${className}
    `}>
      {icon && <span className="text-base">{icon}</span>}
      <span>{value}</span>
      {label && <span className="text-cream/40 text-xs uppercase">{label}</span>}
    </div>
  )
}
