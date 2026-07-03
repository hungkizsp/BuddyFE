import { useState } from 'react';

export default function SpeechBubble({ gameState, message, buddyPosition }) {
  const [isVisible, setIsVisible] = useState(true);
  const isCompleted = gameState === 'completed';

  const wrapperStyle = {
    left: buddyPosition?.left || '47%',
    top: buddyPosition?.top ? `calc(${buddyPosition.top} - 18%)` : '20%',
    transition: gameState === 'walking-to-table'
      ? 'left 2.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 0.3s ease'
      : 'left 0.3s ease, top 0.3s ease',
    pointerEvents: 'auto',
  };

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  const defaultMessage = isCompleted ? 'Yummy!\nThank you!' : "I'm hungry!\nCan you help me with breakfast?";
  const displayMessage = message || defaultMessage;

  return (
    <div
      className={`speech-bubble-wrapper fade-in ${isVisible ? '' : 'speech-bubble-collapsed'}`}
      style={wrapperStyle}
      onClick={toggleVisibility}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggleVisibility();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={isVisible ? 'Hide mission message' : 'Show mission message'}
    >
      <div className={`speech-bubble ${isVisible ? '' : 'collapsed-bubble'}`}>
        <p className="speech-bubble-text">
          {isVisible
            ? displayMessage.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < displayMessage.split('\n').length - 1 ? <br /> : null}
                </span>
              ))
            : '💬'}
        </p>
      </div>
    </div>
  );
}
