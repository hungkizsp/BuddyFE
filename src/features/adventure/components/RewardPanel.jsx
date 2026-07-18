export default function RewardPanel({ xp, coins }) {
  return (
    <div className="ff-reward">
      <div className="ff-reward__item">
        <span className="ff-reward__label">XP</span>
        <span className="ff-reward__value">+{xp}</span>
      </div>
      <div className="ff-reward__divider" />
      <div className="ff-reward__item">
        <span className="ff-reward__icon">{'\uD83E\uDE99'}</span>
        <span className="ff-reward__label">Coins</span>
        <span className="ff-reward__value">+{coins}</span>
      </div>
    </div>
  )
}
