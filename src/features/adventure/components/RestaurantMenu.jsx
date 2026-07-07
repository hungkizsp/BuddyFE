import MenuCard from './MenuCard';

export default function RestaurantMenu({
  categoryTitle = '',
  items = [],
  selectedId = null,
  correctId = null,
  incorrectId = null,
  locked = false,
  onSelectItem,
}) {
  return (
    <section className="restaurant-menu" aria-label={categoryTitle || 'Restaurant menu'}>
      {categoryTitle ? <h2 className="restaurant-menu__title">{categoryTitle}</h2> : null}

      <div className="restaurant-menu__grid">
        {items.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            selected={selectedId === item.id}
            correct={correctId === item.id}
            incorrect={incorrectId === item.id}
            disabled={locked}
            onSelect={onSelectItem}
          />
        ))}
      </div>
    </section>
  );
}
