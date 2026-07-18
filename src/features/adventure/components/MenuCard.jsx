export default function MenuCard({
  item,
  selected = false,
  correct = false,
  incorrect = false,
  disabled = false,
  onSelect,
}) {
  return (
    <button
      type="button"
      className={[
        'menu-card',
        selected ? 'menu-card--selected' : '',
        correct ? 'menu-card--correct' : '',
        incorrect ? 'menu-card--incorrect' : '',
        disabled ? 'menu-card--disabled' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => onSelect?.(item)}
      disabled={disabled}
      aria-label={`Order ${item.label}`}
    >
      <div className="menu-card__image-wrap">
        {item.image ? (
          <img src={item.image} alt={item.alt || item.label} className="menu-card__image" draggable={false} />
        ) : (
          <span className="menu-card__emoji" aria-hidden="true">
            🍽️
          </span>
        )}
      </div>
      <span className="menu-card__label">{item.label}</span>
      {correct && <span className="menu-card__badge" aria-hidden="true">✅</span>}
    </button>
  );
}
