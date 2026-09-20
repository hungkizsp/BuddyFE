

import fruitBasketOpenImg from "../../../assets/fruit-basket-inside.png";
import "./FruitBasketPopup.css";

const FRUIT_INFO = [
  { id: "apple", name: "Apple", meaning: "Quả táo" },
  { id: "banana", name: "Banana", meaning: "Quả chuối" },
  { id: "grapes", name: "Grapes", meaning: "Chùm nho" },
  { id: "pear", name: "Pear", meaning: "Quả lê" },
  { id: "orange", name: "Orange", meaning: "Quả cam" },
];

export default function FruitBasketPopup({ show, fruits = [], onClose, onSelectFruit, returnText = "Trở về căn bếp" }) {
  if (!show) return null;

  return (
    <div className="fruit-basket-popup-overlay" onClick={onClose}>
      <div
        className="fruit-basket-popup-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Choose a fruit"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="fruit-basket-popup-header">
          <h3>Choose a fruit</h3>
          <button className="fruit-basket-popup-close" type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="fruit-basket-popup-image-wrapper">
          <img
            className="fruit-basket-popup-image"
            src={fruitBasketOpenImg}
            alt="Open fruit basket"
          />

          {FRUIT_INFO.map((fruit) => (
            <button
              key={fruit.id}
              type="button"
              className={`fruit-area fruit-area-${fruit.id}`}
              aria-label={`Select ${fruit.name}`}
              onClick={() => onSelectFruit(fruit.id)}
            >
              <span className="fruit-tooltip" aria-hidden="true">
                {fruit.name} ({fruit.meaning})
              </span>
            </button>
          ))}
        </div>

        <div className="fruit-basket-popup-footer">
          <button className="fruit-basket-return-btn" type="button" onClick={onClose}>
            {returnText} ↩
          </button>
        </div>
      </div>
    </div>
  );
}
