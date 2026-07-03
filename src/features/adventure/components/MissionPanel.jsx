export default function MissionPanel({ gameState, onStartMission, instruction: customInstruction }) {
  let statusText = 'Todo';
  let badgeClass = 'todo';
  let instruction = customInstruction || "Click 'Start Mission' to begin the adventure!";
  let buttonText = 'Start Mission';
  let buttonDisabled = false;

  if (gameState === 'walking-to-table') {
    statusText = 'Ongoing';
    badgeClass = 'ongoing';
    instruction = customInstruction || 'Buddy is walking to the kitchen table. Wait for him...';
    buttonText = 'Walking...';
    buttonDisabled = true;
  } else if (gameState === 'idle-at-table') {
    statusText = 'Ongoing';
    badgeClass = 'ongoing';
    buttonText = 'Drag & Drop Food';
    buttonDisabled = true;
  } else if (gameState === 'completed') {
    statusText = 'Completed';
    badgeClass = 'done';
    instruction = customInstruction || 'Mission complete! Buddy is happy and full! 🎉';
    buttonText = 'Completed';
    buttonDisabled = true;
  }

  return (
    <div className="mission-panel-wrapper">
      <div className="mission-panel-header">
        <span>📋 Mission Panel</span>
        <span className={`mission-status-badge ${badgeClass}`}>{statusText}</span>
      </div>
      <div className="mission-instruction">
        {instruction}
      </div>
      <button
        className="mission-start-btn"
        onClick={onStartMission}
        disabled={buttonDisabled}
      >
        {buttonText}
      </button>
    </div>
  );
}
