/**
 * SectionHeader – Consistent page/section heading with optional subtitle and action.
 */
export default function SectionHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 ${className}`}>
      <div>
        <h2 className="font-grotesk text-3xl sm:text-4xl font-bold uppercase text-cream tracking-wide">
          {title}
        </h2>
        {subtitle && (
          <p className="font-mono text-sm text-cream/60 mt-2 max-w-xl uppercase leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
