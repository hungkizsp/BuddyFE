/**
 * PageShell – Wrapper providing the dark canvas background with glow blobs.
 * Every page (except Landing which has its own video bg) should use this.
 */
export default function PageShell({ children, className = '' }) {
  return (
    <div className={`relative min-h-screen bg-navy overflow-hidden ${className}`}>
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-600/[0.08] blur-[140px]" />
        <div className="absolute -bottom-[15%] -right-[10%] w-[45%] h-[45%] rounded-full bg-primary/[0.06] blur-[120px]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-neon/[0.04] blur-[100px]" />
      </div>

      {/* Noise texture */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
