/**
 * Badge – Small label for categories, status, tags.
 */
const VARIANT_MAP = {
  default:  'bg-white/[0.06] text-cream/70 border-white/10',
  success:  'bg-neon/10 text-neon border-neon/20',
  primary:  'bg-primary/10 text-primary border-primary/20',
  warning:  'bg-accent/10 text-accent border-accent/20',
  danger:   'bg-danger/10 text-danger border-danger/20',
  locked:   'bg-white/[0.03] text-cream/40 border-white/5',
}

export default function Badge({ children, variant = 'default', className = '' }) {
  const classes = VARIANT_MAP[variant] || VARIANT_MAP.default
  return (
    <span className={`
      inline-flex items-center gap-1 px-2.5 py-1
      rounded-full border text-xs font-bold uppercase tracking-wider
      font-mono ${classes} ${className}
    `}>
      {children}
    </span>
  )
}
