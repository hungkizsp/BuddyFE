/**
 * IconButton – Small circular button with optional badge.
 */
export default function IconButton({ icon, onClick, badge, title, active = false, className = '' }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        relative w-11 h-11 rounded-xl
        flex items-center justify-center
        glass-simple border border-white/10
        text-cream/70 text-lg
        transition-all duration-200
        hover:bg-white/10 hover:text-cream hover:scale-105
        ${active ? 'bg-primary/20 border-primary/30 text-primary' : ''}
        ${className}
      `}
    >
      {icon}
      {badge != null && badge > 0 && (
        <span className="
          absolute -top-1.5 -right-1.5
          min-w-[18px] h-[18px] px-1
          rounded-full
          bg-gradient-to-r from-danger to-red-500
          text-white text-[10px] font-bold
          flex items-center justify-center
          animate-pulse
        ">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  )
}
