import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdventureScene from '../components/AdventureScene';
import DraggableItem from '../components/DraggableItem';
import SpeechBubble from '../components/SpeechBubble';
import MissionPanel from '../components/MissionPanel';
import RewardPopup from '../components/RewardPopup';
import '../styles/KitchenAdventurePage.css';
import appleImg from '../../../assets/apple.png';
import bananaImg from '../../../assets/banana.png';
import breadImg from '../../../assets/bread.png';
import eggImg from '../../../assets/egg.png';
import milkImg from '../../../assets/milk.png';
import eggOnToastImg from '../../../assets/egg-on-toast.png';

const INITIAL_TABLE_ITEMS = [
  { id: 'banana', label: 'Banana', emoji: '🍌', image: bananaImg, alt: 'Banana' },
  { id: 'egg', label: 'Egg', emoji: '🥚', image: eggImg, alt: 'Egg' },
  { id: 'bread', label: 'Bread', emoji: '🍞', image: breadImg, alt: 'Bread' },
  { id: 'milk', label: 'Milk', emoji: '🥛', image: milkImg, alt: 'Milk' }
];

const eggOnToastItem = {
  id: 'egg-on-toast',
  label: 'Egg on Toast',
  emoji: '🍳',
  image: eggOnToastImg,
  alt: 'Egg on Toast'
};

const appleItem = {
  id: 'apple',
  label: 'Apple',
  emoji: '🍎',
  image: appleImg,
  alt: 'Apple'
};

const ITEM_POSITIONS = {
  banana: { left: '22%', top: '70%' },
  egg: { left: '36%', top: '60%' },
  bread: { left: '50%', top: '72%' },
  milk: { left: '64%', top: '60%' },
  'egg-on-toast': { left: '47%', top: '48%' },
  apple: { left: '74%', top: '60%' }
};

export default function KitchenAdventurePage() {
  const navigate = useNavigate();

  const [gameState, setGameState] = useState('not-started');
  const [tableItems, setTableItems] = useState(INITIAL_TABLE_ITEMS);
  const [missionStage, setMissionStage] = useState(0);
  const [preparedEggOnToast, setPreparedEggOnToast] = useState(false);
  const [potContents, setPotContents] = useState([]);
  const [buddyPosition, setBuddyPosition] = useState({ left: '47%', top: '55%' });
  const [isDraggingBuddy, setIsDraggingBuddy] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('Buddy is waiting. Start the kitchen mission to begin.');
  const [missionPanelVisible, setMissionPanelVisible] = useState(true);
  const [xp, setXp] = useState(60);
  const [coins, setCoins] = useState(15);
  const [showRewards, setShowRewards] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const buddyDragStartRef = useRef({ x: 0, y: 0, left: 0, top: 0 });

  const handleStartMission = () => {
    if (gameState === 'not-started') {
      setGameState('walking-to-table');
      setTableItems(INITIAL_TABLE_ITEMS);
      setMissionStage(0);
      setPreparedEggOnToast(false);
      setPotContents([]);
      setBuddyPosition({ left: '47%', top: '55%' });
      setFeedbackMessage('Buddy is walking to the kitchen table. Combine bread and egg in the pot to make egg on toast.');
      setShowRewards(false);
    }
  };

  const handleArrivedAtTable = () => {
    if (gameState === 'walking-to-table') {
      setGameState('idle-at-table');
    }
  };

  const handleDropOnBuddy = (itemId) => {
    if (gameState !== 'idle-at-table') return;

    if (itemId === 'banana') {
      setFeedbackMessage("Buddy: Today I don't want banana. Try something else.");
      return;
    }

    if (itemId === 'bread' || itemId === 'egg') {
      setFeedbackMessage('Buddy: I want egg on toast, not plain bread or egg. Combine them first.');
      return;
    }

    if (itemId === 'egg-on-toast') {
      if (missionStage === 0) {
        setMissionStage(1);
        setFeedbackMessage('Buddy: Egg on toast is perfect! Now please give me milk.');
        setTableItems((prev) => prev.filter((item) => item.id !== 'egg-on-toast'));
      }
      return;
    }

    if (itemId === 'milk') {
      if (missionStage === 0) {
        setFeedbackMessage('Buddy: I need egg on toast first.');
        return;
      }
      if (missionStage === 1) {
        setMissionStage(2);
        setFeedbackMessage('Buddy: Milk is refreshing! Now the apple is unlocked.');
        setTableItems((prev) => prev.filter((item) => item.id !== 'milk').concat(appleItem));
      }
      return;
    }

    if (itemId === 'apple') {
      if (missionStage === 0) {
        setFeedbackMessage('Buddy: Egg on toast first, then milk, then apple.');
        return;
      }
      if (missionStage === 1) {
        setFeedbackMessage('Buddy: I want milk before apple.');
        return;
      }
      if (missionStage === 2) {
        setMissionStage(3);
        setGameState('completed');
        setFeedbackMessage('Buddy: Yummy! Thank you!');
        setXp((prev) => prev + 20);
        setCoins((prev) => prev + 10);
        setTableItems((prev) => prev.filter((item) => item.id !== 'apple'));
        setShowRewards(true);
      }
      return;
    }

    setFeedbackMessage('Buddy: That does not look like the food I need right now.');
  };

  const handleCombineItems = (draggedId, targetId) => {
    if (gameState !== 'idle-at-table') return false;
    if (missionStage !== 0 || preparedEggOnToast) {
      setFeedbackMessage('Buddy is waiting for food in the right order.');
      return false;
    }

    const isPair = new Set([draggedId, targetId]);
    if (isPair.has('bread') && isPair.has('egg')) {
      setPreparedEggOnToast(true);
      setFeedbackMessage('Great! You made egg on toast. Feed it to Buddy now.');
      setTableItems((prev) => prev.filter((item) => item.id !== 'bread' && item.id !== 'egg').concat(eggOnToastItem));
      return true;
    }

    setFeedbackMessage('Those items cannot be combined. Try bread and egg.');
    return false;
  };

  const handleDropOnPot = (itemId) => {
    if (gameState !== 'idle-at-table') return false;

    if (itemId !== 'bread' && itemId !== 'egg') {
      setFeedbackMessage('Only bread and egg can go into the pot to make egg on toast.');
      return false;
    }

    if (potContents.includes(itemId)) {
      setFeedbackMessage(`That ${itemId} is already in the pot.`);
      return false;
    }

    const nextContents = [...potContents, itemId];
    setPotContents(nextContents);
    setTableItems((prev) => prev.filter((item) => item.id !== itemId));

    if (nextContents.includes('bread') && nextContents.includes('egg')) {
      setPreparedEggOnToast(true);
      setPotContents([]);
      setTableItems((prev) => prev.concat(eggOnToastItem));
      setFeedbackMessage('Egg on toast is ready! Drag it to Buddy now.');
      return true;
    }

    setFeedbackMessage(`Added ${itemId} to the pot. Add the other ingredient.`);
    return true;
  };

  const getMissionInstruction = () => {
    if (gameState === 'not-started') {
      return "Click 'Start Mission' to begin the kitchen adventure.";
    }
    if (gameState === 'walking-to-table') {
      return 'Buddy is walking to the table...';
    }
    if (gameState === 'idle-at-table') {
      if (missionStage === 0) {
        return 'Combine bread + egg into egg on toast, then feed Buddy milk. Banana is rejected.';
      }
      if (missionStage === 1) {
        return 'Buddy ate egg on toast! Give him milk now to unlock the apple.';
      }
      if (missionStage === 2) {
        return 'One more step: give Buddy the apple to complete the mission.';
      }
    }
    return 'Mission complete! Buddy is happy and full! 🎉';
  };

  const handleToggleMic = () => {
    setIsListening((prev) => !prev);
  };

  const handleBuddyPointerDown = (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDraggingBuddy(true);
    buddyDragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      left: parseFloat(buddyPosition.left),
      top: parseFloat(buddyPosition.top)
    };
  };

  const handleBuddyPointerMove = (e) => {
    if (!isDraggingBuddy) return;
    const deltaX = e.clientX - buddyDragStartRef.current.x;
    const deltaY = e.clientY - buddyDragStartRef.current.y;
    const left = Math.min(90, Math.max(10, buddyDragStartRef.current.left + (deltaX / window.innerWidth) * 100));
    const top = Math.min(85, Math.max(15, buddyDragStartRef.current.top + (deltaY / window.innerHeight) * 100));
    setBuddyPosition({ left: `${left}%`, top: `${top}%` });
  };

  const handleBuddyPointerUp = (e) => {
    if (!isDraggingBuddy) return;
    setIsDraggingBuddy(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleCloseRewards = () => {
    setShowRewards(false);
  };

  const handleToggleMissionPanel = () => {
    setMissionPanelVisible((prev) => !prev);
  };

  const buddy3DPosition = [
    (parseFloat(buddyPosition.left) - 47) / 10,
    -1.8 + (50 - parseFloat(buddyPosition.top)) / 10,
    0
  ];

  return (
    <div className="kitchen-adv-container">
      <AdventureScene
        gameState={gameState}
        onArrivedAtTable={handleArrivedAtTable}
        buddyPosition={buddy3DPosition}
      />

      {gameState === 'idle-at-table' && (
        <>
          <div
            className="pot-drop-zone"
            aria-label="Pot area for egg on toast"
          >
            <span>Pot</span>
          </div>
          <div
            className="buddy-drop-target"
            style={{ left: buddyPosition.left, top: buddyPosition.top }}
          />
          <button
            className="buddy-drag-handle"
            style={{ left: buddyPosition.left, top: buddyPosition.top }}
            onPointerDown={handleBuddyPointerDown}
            onPointerMove={handleBuddyPointerMove}
            onPointerUp={handleBuddyPointerUp}
            onPointerCancel={handleBuddyPointerUp}
            type="button"
          >
            Drag Buddy
          </button>
        </>
      )}

      <div className="kitchen-table-items">
        {tableItems.map((item) => (
          <DraggableItem
            key={item.id}
            item={item}
            position={ITEM_POSITIONS[item.id]}
            onDropOnBuddy={handleDropOnBuddy}
            onDropOnItem={handleCombineItems}
            onDropOnPot={handleDropOnPot}
            disabled={gameState !== 'idle-at-table'}
          />
        ))}
      </div>

      <header className="hud-header">
        <div className="hud-title-container">
          <span className="hud-title-forest">🔍 Food Forest</span>
          <span className="hud-title-level">Breakfast Trouble</span>
        </div>

        <div className="hud-stats-container">
          <div className="stat-card">
            <span className="stat-icon xp-color">🌟</span>
            <span>XP: {xp}</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon coin-color">🪙</span>
            <span>Coins: {coins}</span>
          </div>
        </div>
      </header>

      <div className="mission-panel-toggle-wrapper">
        <button
          className="mission-toggle-btn"
          onClick={handleToggleMissionPanel}
          type="button"
        >
          {missionPanelVisible ? 'Hide Mission Panel' : 'Show Mission Panel'}
        </button>
      </div>

      {missionPanelVisible && (
        <MissionPanel
          gameState={gameState}
          onStartMission={handleStartMission}
          instruction={getMissionInstruction()}
        />
      )}

      <div className="mic-button-wrapper">
        <button
          className={`mic-btn ${isListening ? 'active-listening' : ''}`}
          onClick={handleToggleMic}
          aria-label="Microphone"
        >
          🎤
        </button>
      </div>

      <button
        className="back-to-map-btn"
        onClick={() => navigate('/adventure/food-forest')}
      >
        ← Back to Map
      </button>

      {gameState !== 'not-started' && (
        <SpeechBubble gameState={gameState} message={feedbackMessage} buddyPosition={buddyPosition} />
      )}

      <RewardPopup
        show={showRewards}
        xpReward={20}
        coinReward={10}
        onClose={handleCloseRewards}
      />
    </div>
  );
}
