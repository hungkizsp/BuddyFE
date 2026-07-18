

import fruitBasketOpenImg from "../../../assets/fruit-basket-inside.png";
import "./FruitBasketPopup.css";

export default function FruitBasketPopup({ show, fruits = [], onClose, onSelectFruit, returnText = "Return to Kitchen" }) {
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

          <button
            type="button"
            className="fruit-area fruit-area-apple"
            aria-label="Select Apple"
            onClick={() => onSelectFruit("apple")}
          />
          <button
            type="button"
            className="fruit-area fruit-area-banana"
            aria-label="Select Banana"
            onClick={() => onSelectFruit("banana")}
          />
          <button
            type="button"
            className="fruit-area fruit-area-grapes"
            aria-label="Select Grapes"
            onClick={() => onSelectFruit("grapes")}
          />
          <button
            type="button"
            className="fruit-area fruit-area-pear"
            aria-label="Select Pear"
            onClick={() => onSelectFruit("pear")}
          />
          <button
            type="button"
            className="fruit-area fruit-area-orange"
            aria-label="Select Orange"
            onClick={() => onSelectFruit("orange")}
          />
        </div>

        <div className="fruit-basket-popup-footer">
          <button className="fruit-basket-return-btn" type="button" onClick={onClose}>
            {returnText} ↩️
          </button>
        </div>
      </div>
    </div>
  );
}
