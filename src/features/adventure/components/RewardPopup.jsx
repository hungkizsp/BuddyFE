import EmoteShooter from './EmoteShooter';

export default function RewardPopup({ show, xpReward, coinReward, onClose }) {
  if (!show) return null;

  return (
    <div className="reward-popup-overlay">
      <EmoteShooter />
      <div className="reward-card">
        <div className="reward-stars">⭐⭐⭐</div>
        <h2 className="reward-title">Mission Complete!</h2>
        
        <div className="reward-items-container">
          {/* XP Pill */}
          <div className="reward-item-pill">
            <span className="reward-item-emoji">🌟</span>
            <span className="reward-item-value xp-color">+{xpReward} XP</span>
          </div>

          {/* Coins Pill */}
          <div className="reward-item-pill">
            <span className="reward-item-emoji">🪙</span>
            <span className="reward-item-value coin-color">+{coinReward} Coins</span>
          </div>
        </div>

        <button className="reward-close-btn" onClick={onClose}>
          Claim Rewards! 🚀
        </button>
      </div>
    </div>
  );
}
