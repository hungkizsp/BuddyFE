import { useState } from 'react';

// =============================================================================
// HOTSPOT CONFIGURATION
// Edit positions here — no JSX changes needed.
//
// Each key matches the `expectedEntity` value from the API step.
// Each entry maps vocabulary item-id → { left, top, width, height } in %.
// Positions are relative to the background image container.
// =============================================================================

export const SCENE_HOTSPOTS = {
  // ── Step 1: Vegetable Counter (fruit_counter.png / fruitCounter) ───────────
  VEGETABLES: {
    broccoli: { left: '15%', top: '22%', width: '15%', height: '20%' },
    cucumber: { left: '40%', top: '24%', width: '17%', height: '20%' },
    potato: { left: '67%', top: '24%', width: '20%', height: '20%' },
    onion: { left: '10%', top: '55%', width: '12%', height: '21%' },
    // distractors
    watermelon: { left: '33%', top: '55%', width: '14%', height: '21%' },
    banana: { left: '55%', top: '55%', width: '14%', height: '21%' },
    apple: { left: '78%', top: '55%', width: '14%', height: '21%' },
  },

  // ── Step 2: Fridge (fridge.png) ───────────────────────────────────────────
  SNACK_DAIRY: {
    cheese: { left: '58%', top: '60%', width: '35%', height: '17%' },
    yogurt: { left: '8%', top: '40%', width: '35%', height: '17%' },
    butter: { left: '8%', top: '60%', width: '35%', height: '17%' },
    crackers: { left: '10%', top: '18%', width: '35%', height: '15%' },
    // distractors
    chocolate: { left: '57%', top: '18%', width: '35%', height: '15%' },
    candy: { left: '55%', top: '40%', width: '38%', height: '17%' },
  },

  // ── Step 4: Meat Counter (food_counter.png / foodCounter) ──────────────────
  MEAT: {
    chicken: { left: '20%', top: '20%', width: '18%', height: '26%' },
    beef: { left: '40%', top: '20%', width: '18%', height: '26%' },
    pork: { left: '60%', top: '20%', width: '18%', height: '26%' },
    // distractors
    fish: { left: '18%', top: '50%', width: '18%', height: '26%' },
    shrimp: { left: '40%', top: '50%', width: '20%', height: '28%' },
    crab: { left: '60%', top: '50%', width: '25%', height: '28%' },
  },
};

const VIETNAMESE_MEANINGS = {
  broccoli: 'Bông cải xanh',
  cucumber: 'Dưa chuột',
  potato: 'Khoai tây',
  onion: 'Hành tây',
  watermelon: 'Dưa hấu',
  banana: 'Quả chuối',
  apple: 'Quả táo',
  cheese: 'Phô mai',
  yogurt: 'Sữa chua',
  butter: 'Bơ',
  crackers: 'Bánh quy',
  chocolate: 'Sô-cô-la',
  candy: 'Kẹo',
  chicken: 'Thịt gà',
  beef: 'Thịt bò',
  pork: 'Thịt heo',
  fish: 'Con cá',
  shrimp: 'Con tôm',
  crab: 'Con cua',
  bread: 'Bánh mì',
  egg: 'Quả trứng',
  milk: 'Sữa',
  orange: 'Quả cam',
  pear: 'Quả lê',
  grapes: 'Chùm nho',
};

// =============================================================================
// ShoppingCounter – Scene-based component
// =============================================================================
export default function ShoppingCounter({
  backgroundImage,
  backgroundAlt = 'Shopping area',
  sceneKey = '',
  correctItems = [],
  wrongItems = [],
  collectedIds = new Set(),
  onCorrect,
  onWrong,
  onReturn,
  devMode = false,
}) {
  const [shakingId, setShakingId] = useState(null);

  // Build a flat lookup: id → { isCorrect, label }
  const itemMap = {};
  correctItems.forEach((item) => { itemMap[item.id] = { ...item, isCorrect: true }; });
  wrongItems.forEach((item) => { itemMap[item.id] = { ...item, isCorrect: false }; });

  const hotspots = SCENE_HOTSPOTS[sceneKey] ?? {};

  const handleHotspotClick = (hotspotId) => {
    if (collectedIds.has(hotspotId)) return;

    const entry = itemMap[hotspotId];
    if (!entry) return; // hotspot defined but no matching vocabulary (safety guard)

    if (entry.isCorrect) {
      onCorrect?.(hotspotId);
    } else {
      setShakingId(hotspotId);
      onWrong?.(hotspotId);
      setTimeout(() => setShakingId(null), 600);
    }
  };

  const allCollected =
    correctItems.length > 0 && correctItems.every((item) => collectedIds.has(item.id));

  return (
    <div className={`shopping-scene shopping-scene--${sceneKey.toLowerCase()}`}>
      {/* Return to Supermarket Button */}
      {onReturn && (
        <button
          type="button"
          className="shopping-scene__return-btn"
          onClick={onReturn}
          aria-label="Return to Supermarket"
        >
          Trở về siêu thị
        </button>
      )}

      {/* Full-size background image */}
      <img
        src={backgroundImage}
        alt={backgroundAlt}
        className="shopping-scene__bg"
        draggable={false}
      />

      {/* Transparent hotspot buttons positioned over the image */}
      {Object.entries(hotspots).map(([hotspotId, pos]) => {
        const collected = collectedIds.has(hotspotId);
        const isShaking = shakingId === hotspotId;
        const englishLabel = itemMap[hotspotId]?.label ?? hotspotId;
        const vietnameseMeaning = itemMap[hotspotId]?.meaning || VIETNAMESE_MEANINGS[hotspotId.toLowerCase()];
        const displayLabel = vietnameseMeaning ? `${englishLabel} (${vietnameseMeaning})` : englishLabel;

        return (
          <button
            key={hotspotId}
            type="button"
            className={[
              'hotspot',
              collected ? 'hotspot--collected' : '',
              isShaking ? 'hotspot--shake' : '',
              devMode ? 'hotspot--dev' : '',
            ].filter(Boolean).join(' ')}
            style={{
              left: pos.left,
              top: pos.top,
              width: pos.width,
              height: pos.height,
            }}
            onClick={() => handleHotspotClick(hotspotId)}
            aria-label={
              collected
                ? `${englishLabel} — collected`
                : `Pick up ${englishLabel}`
            }
            disabled={collected}
          >
            {/* Collected tick badge */}
            {collected && (
              <span className="hotspot__collected-badge" aria-hidden="true">✅</span>
            )}

            {/* Label tooltip shown on hover (helps players learn the word) */}
            {!collected && (
              <span className="hotspot__label" aria-hidden="true">
                {displayLabel}
              </span>
            )}
          </button>
        );
      })}

      {/* All-collected overlay */}
      {allCollected && (
        <div className="shopping-scene__all-done">
          <span>✅</span>
          <p>All done!</p>
        </div>
      )}
    </div>
  );
}
