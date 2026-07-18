/**
 * SkeletonCard – Loading placeholder with pulse animation.
 */
export default function SkeletonCard({ className = '' }) {
  return (
    <div className={`glass-simple rounded-2xl overflow-hidden animate-pulse ${className}`}>
      {/* Image skeleton */}
      <div className="w-full aspect-square bg-white/[0.04]" />
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-5 bg-white/[0.06] rounded-lg w-3/4" />
        <div className="h-3 bg-white/[0.04] rounded-lg w-1/2" />
        <div className="h-3 bg-white/[0.04] rounded-lg w-2/3" />
        <div className="flex gap-1 pt-1">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-4 h-4 bg-white/[0.05] rounded-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
