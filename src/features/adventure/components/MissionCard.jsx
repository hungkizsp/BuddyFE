import RewardPanel from './RewardPanel'

const CARD_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
]

export default function MissionCard({
  mission,
  index,
  isCompleted,
  xpReward,
  coinReward,
}) {
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length]

  return (
    <div className={`ff-card ${isCompleted ? 'ff-card--completed' : ''}`}>
      {isCompleted && (
        <div className="ff-card__ribbon">Completed</div>
      )}
      <div
        className="ff-card__bg"
        style={{ backgroundImage: gradient }}
      />
      <div className="ff-card__overlay" />
      <div className="ff-card__content">
        <div className="ff-card__top">
          <span className="ff-card__difficulty" data-diff={mission.difficulty}>
            {mission.difficulty}
          </span>
          <span className="ff-card__num">Mission {index + 1}</span>
        </div>
        <div className="ff-card__center">
          <h3 className="ff-card__title">{mission.name}</h3>
          <p className="ff-card__desc">{mission.tooltip}</p>
        </div>
        <RewardPanel xp={xpReward} coins={coinReward} />
      </div>
    </div>
  )
}
