import { getStepLabel } from '../utils/scenarioUtils';

export default function RestaurantProgress({ steps = [], currentIndex = 0, completedIndexes = new Set() }) {
  if (steps.length === 0) return null;

  return (
    <nav className="restaurant-progress" aria-label="Order progress">
      <ul className="restaurant-progress__list">
        {steps.map((step, index) => {
          const isCurrent = index === currentIndex;
          const isDone = completedIndexes.has(index) || index < currentIndex;

          return (
            <li
              key={step.id || `${step.stepOrder}-${step.expectedEntity}`}
              className={[
                'restaurant-progress__item',
                isCurrent ? 'restaurant-progress__item--current' : '',
                isDone ? 'restaurant-progress__item--done' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="restaurant-progress__icon" aria-hidden="true">
                {isDone ? '✔' : index + 1}
              </span>
              <span className="restaurant-progress__label">{getStepLabel(step)}</span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
