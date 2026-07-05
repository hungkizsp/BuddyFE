/**
 * ShoppingChecklist
 *
 * Props:
 *  items         – Array of { id, label } for required items
 *  collectedIds  – Set<string> of already-collected IDs
 *  title         – Optional panel title
 */
export default function ShoppingChecklist({ items = [], collectedIds = new Set(), title = '🛒 Shopping List' }) {
  const total = items.length;
  const collected = items.filter((i) => collectedIds.has(i.id)).length;

  return (
    <div className="shopping-checklist">
      <div className="shopping-checklist__header">
        <span className="shopping-checklist__title">{title}</span>
        <span className="shopping-checklist__progress">
          {collected}/{total}
        </span>
      </div>

      <ul className="shopping-checklist__list" role="list">
        {items.map((item) => {
          const done = collectedIds.has(item.id);
          return (
            <li
              key={item.id}
              className={`shopping-checklist__item ${done ? 'shopping-checklist__item--done' : ''}`}
              aria-label={`${item.label} — ${done ? 'collected' : 'not yet collected'}`}
            >
              <span className="shopping-checklist__icon">{done ? '✅' : '⬜'}</span>
              <span className="shopping-checklist__item-label">{item.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
