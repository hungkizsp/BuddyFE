export default function ArrowNavigation({ direction, onClick, disabled }) {
  return (
    <button
      className={`ff-arrow ff-arrow--${direction}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Previous mission' : 'Next mission'}
      type="button"
    >
      <span className="ff-arrow__icon">{direction === 'prev' ? '\u276E' : '\u276F'}</span>
    </button>
  )
}
