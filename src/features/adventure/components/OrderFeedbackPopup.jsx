export default function OrderFeedbackPopup({ show, type = 'success', message = '', onClose }) {
  if (!show) return null;

  const isSuccess = type === 'success';

  return (
    <div className="order-feedback-overlay" role="dialog" aria-live="polite">
      <div className={`order-feedback-card order-feedback-card--${type}`}>
        <span className="order-feedback-card__icon" aria-hidden="true">
          {isSuccess ? '✅' : '❌'}
        </span>
        <p className="order-feedback-card__message">{message}</p>
        {!isSuccess && onClose ? (
          <button type="button" className="order-feedback-card__close" onClick={onClose}>
            Try again
          </button>
        ) : null}
      </div>
    </div>
  );
}
