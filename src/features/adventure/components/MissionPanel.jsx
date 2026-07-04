export default function MissionPanel({
  gameState,
  onStartMission,
  instruction: customInstruction,
  title,
  description,
  loading = false,
  error = '',
  startDisabled = false,
}) {
  let statusText = 'Todo'
  let badgeClass = 'todo'
  let instruction = customInstruction || description || "Click 'Start Mission' to begin the adventure."
  let buttonText = loading ? 'Loading...' : 'Start Mission'
  let buttonDisabled = loading || Boolean(error) || startDisabled

  if (gameState === 'walking-to-table') {
    statusText = 'Ongoing'
    badgeClass = 'ongoing'
    instruction = customInstruction || description || 'Buddy is walking to the kitchen table.'
    buttonText = 'Walking...'
    buttonDisabled = true
  } else if (gameState === 'idle-at-table') {
    statusText = 'Ongoing'
    badgeClass = 'ongoing'
    buttonText = 'Drag & Drop Food'
    buttonDisabled = true
  } else if (gameState === 'completed') {
    statusText = 'Completed'
    badgeClass = 'done'
    instruction = customInstruction || description || 'Mission complete. Buddy is happy and full.'
    buttonText = 'Completed'
    buttonDisabled = true
  }

  return (
    <div className="mission-panel-wrapper">
      <div className="mission-panel-header">
        <span>{title || 'Mission Panel'}</span>
        <span className={`mission-status-badge ${badgeClass}`}>{statusText}</span>
      </div>
      {description ? <div className="mission-description">{description}</div> : null}
      <div className="mission-instruction">{error || instruction}</div>
      <button
        className="mission-start-btn"
        onClick={onStartMission}
        disabled={buttonDisabled}
        type="button"
      >
        {buttonText}
      </button>
    </div>
  )
}
