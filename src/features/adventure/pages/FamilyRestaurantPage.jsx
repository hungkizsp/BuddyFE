import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import AdventureScene from '../components/AdventureScene';
import MissionPanel from '../components/MissionPanel';
import SpeechBubble from '../components/SpeechBubble';
import RewardPopup from '../components/RewardPopup';
import VoiceMission from '../components/VoiceMission';
import RestaurantProgress from '../components/RestaurantProgress';
import OrderFeedbackPopup from '../components/OrderFeedbackPopup';

import useScenarioSteps from '../hooks/useScenarioSteps';
import useScenarioVocabulary from '../hooks/useScenarioVocabulary';
import learningService from '../services/learningService';
import profileService from '../services/profileService';
import progressService from '../services/progressService';
import { useAuthStore } from '../../auth/store/authStore';
import { toMenuItem } from '../utils/vocabularyUtils';
import {
  getCorrectMenuItem,
  getExpectedSentence,
  getGameplaySteps,
  getMenuItemsForStep,
  getStepLabel,
  INTENT_MISSION_COMPLETE,
  isOrderStep,
} from '../utils/scenarioUtils';

import '../styles/KitchenAdventurePage.css';
import '../styles/SupermarketShoppingPage.css';
import '../styles/FamilyRestaurantPage.css';

import orderPerson from '../../../assets/order_person.png';
import menuImg from '../../../assets/menu.png';
import BackgroundMusic from '../components/BackgroundMusic';
import bgMusicSrc from '../../../assets/Music/Kitchen_Floor_Carnival.mp3';

export default function FamilyRestaurantPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const routeScenario = location.state?.scenario;
  const scenarioId = routeScenario?.id || searchParams.get('scenarioId');

  const { steps: scenarioSteps, loading: stepsLoading, error: stepsError } = useScenarioSteps(scenarioId);
  const { vocabularies, loading: vocabularyLoading, error: vocabularyError } = useScenarioVocabulary(scenarioId);
  const [scenario, setScenario] = useState(routeScenario || null);
  const [scenarioLoading, setScenarioLoading] = useState(!routeScenario && Boolean(scenarioId));
  const [scenarioError, setScenarioError] = useState('');

  const [gameState, setGameState] = useState('not-started');
  const [missionStage, setMissionStage] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showReward, setShowReward] = useState(false);
  const [missionPanelVisible, setMissionPanelVisible] = useState(true);
  const [xp, setXp] = useState(90);
  const [coins, setCoins] = useState(25);
  const { childProfile, loadChildProfile } = useAuthStore();

  const [selectedId, setSelectedId] = useState(null);
  const [correctId, setCorrectId] = useState(null);
  const [incorrectId, setIncorrectId] = useState(null);
  const [stepLocked, setStepLocked] = useState(false);
  const [completedStepIndexes, setCompletedStepIndexes] = useState(new Set());
  const [feedbackPopup, setFeedbackPopup] = useState({ show: false, type: 'success', message: '' });
  const [waiterClicked, setWaiterClicked] = useState(false);

  const advanceTimerRef = useRef(null);

  useEffect(() => {
    if (routeScenario || !scenarioId) return undefined;

    let ignore = false;

    const loadScenario = async () => {
      try {
        setScenarioLoading(true);
        setScenarioError('');
        const data = await learningService.getScenario(scenarioId);
        if (!ignore) setScenario(data);
      } catch (err) {
        if (!ignore) setScenarioError(err.message || 'Không thể tải kịch bản.');
      } finally {
        if (!ignore) setScenarioLoading(false);
      }
    };

    loadScenario();
    return () => {
      ignore = true;
    };
  }, [routeScenario, scenarioId]);

  // ── Update profile when reward is shown (stage completed) ──
  useEffect(() => {
    if (!showReward || !childProfile?.id || !scenarioId) return;

    const completeAndReward = async () => {
      try {
        const vocabIds = vocabularies.map((v) => v.vocabularyId).filter(Boolean);
        const progressRes = await progressService.completeScenario({
          childId: childProfile.id,
          scenarioId: parseInt(scenarioId, 10),
          score: 100,
          vocabularyIds: vocabIds,
        });

        if (!progressRes.alreadyCompleted) {
          const currentXp = childProfile?.xp ?? 0;
          const currentCoins = childProfile?.coins ?? 0;
          await profileService.updateChildProfile({
            xp: currentXp + xp,
            coins: currentCoins + coins,
          });
          await loadChildProfile();
        } else {
          setXp(0);
          setCoins(0);
        }
      } catch (err) {
        console.error('Failed to complete scenario or update profile:', err);
      }
    };

    completeAndReward();
  }, [showReward]);

  useEffect(
    () => () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    },
    [],
  );

  const orderingSteps = useMemo(() => getGameplaySteps(scenarioSteps), [scenarioSteps]);
  const activeStep = scenarioSteps[missionStage] ?? null;
  const activeOrderIndex = useMemo(() => {
    if (!activeStep) return 0;
    const index = orderingSteps.findIndex(
      (step) => step.id === activeStep.id || step.stepOrder === activeStep.stepOrder,
    );
    return index >= 0 ? index : 0;
  }, [activeStep, orderingSteps]);

  const menuItems = useMemo(() => {
    if (!activeStep) return [];
    return getMenuItemsForStep(vocabularies, activeStep).map(toMenuItem);
  }, [activeStep, vocabularies]);

  const correctItem = useMemo(() => {
    if (!activeStep) return null;
    const item = getCorrectMenuItem(vocabularies, activeStep, menuItems);
    return item ? toMenuItem(item) : null;
  }, [activeStep, menuItems, vocabularies]);

  const expectedSentence = useMemo(
    () => getExpectedSentence(activeStep, correctItem),
    [activeStep, correctItem],
  );

  const resetStepVisualState = useCallback(() => {
    setSelectedId(null);
    setCorrectId(null);
    setIncorrectId(null);
    setStepLocked(false);
    setFeedbackPopup({ show: false, type: 'success', message: '' });
  }, []);

  useEffect(() => {
    resetStepVisualState();
    setWaiterClicked(false);
  }, [missionStage, resetStepVisualState]);

  useEffect(() => {
    if (activeStep?.expectedIntent === INTENT_MISSION_COMPLETE && gameState === 'ordering') {
      setGameState('completed');
      setFeedbackMessage(activeStep.successResponse || 'Hoàn thành nhiệm vụ!');
      setShowReward(true);
    }
  }, [activeStep, gameState]);

  const advanceToNextStep = useCallback(() => {
    const nextStep = scenarioSteps[missionStage + 1];

    if (!nextStep) {
      setGameState('completed');
      setFeedbackMessage('Hoàn thành kịch bản!');
      setShowReward(true);
      return;
    }

    if (nextStep.expectedIntent === INTENT_MISSION_COMPLETE) {
      setMissionStage((prev) => prev + 1);
      return;
    }

    setCompletedStepIndexes((prev) => new Set([...prev, activeOrderIndex]));
    setMissionStage((prev) => prev + 1);
    setFeedbackMessage(nextStep.buddyMessage || '');
  }, [activeOrderIndex, missionStage, scenarioSteps]);

  const handleStepSuccess = useCallback(
    (message, itemId) => {
      if (stepLocked) return;

      setStepLocked(true);
      setSelectedId(itemId || correctItem?.id || null);
      setCorrectId(itemId || correctItem?.id || null);
      setIncorrectId(null);
      setFeedbackMessage(message || activeStep?.successResponse || 'Tuyệt vời!');

      setFeedbackPopup({
        show: true,
        type: 'success',
        message: message || activeStep?.successResponse || 'Tuyệt vời!',
      });

      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = setTimeout(() => {
        setFeedbackPopup({ show: false, type: 'success', message: '' });
        advanceToNextStep();
      }, 900);
    },
    [activeStep, advanceToNextStep, correctItem?.id, stepLocked],
  );

  const handleStepFailure = useCallback(
    (message, itemId = null) => {
      if (stepLocked) return;

      setIncorrectId(itemId || selectedId);
      setFeedbackMessage(message || activeStep?.failResponse || 'Hãy thử lại nhé!');

      setFeedbackPopup({
        show: true,
        type: 'failure',
        message: message || activeStep?.failResponse || 'Hãy thử lại nhé!',
      });
    },
    [activeStep, selectedId, stepLocked],
  );

  const handleStartMission = () => {
    if (gameState !== 'not-started') return;

    setMissionStage(0);
    setCompletedStepIndexes(new Set());
    resetStepVisualState();
    setShowReward(false);
    setGameState('ordering');
    setFeedbackMessage(scenarioSteps[0]?.buddyMessage || scenario?.description || '');
  };

  const handleMenuSelect = (item) => {
    if (stepLocked || !isOrderStep(activeStep)) return;

    setSelectedId(item.id);
    setIncorrectId(null);

    if (correctItem && item.id === correctItem.id) {
      handleStepSuccess(activeStep?.successResponse, item.id);
      return;
    }

    handleStepFailure(activeStep?.failResponse, item.id);
  };

  const handleVoiceSuccess = () => {
    handleStepSuccess(activeStep?.successResponse, correctItem?.id);
  };

  const handleVoiceFail = () => {
    setFeedbackMessage(activeStep?.failResponse || 'Hãy thử nói lại câu order nhé!');
  };

  const handleDismissFailurePopup = () => {
    setFeedbackPopup({ show: false, type: 'failure', message: '' });
    setIncorrectId(null);
  };

  const getMissionInstruction = () => {
    const anyLoading = scenarioLoading || vocabularyLoading || stepsLoading;
    const anyError = scenarioError || vocabularyError || stepsError;

    if (anyLoading) return 'Đang tải dữ liệu nhiệm vụ…';
    if (anyError) return anyError;
    if (!scenarioId) return 'Chọn một kịch bản để bắt đầu.';
    if (gameState === 'not-started') {
      return scenario?.description || "Nhấn 'Bắt đầu nhiệm vụ' để bắt đầu.";
    }
    return activeStep?.buddyMessage || 'Hoàn thành bước gọi món hiện tại.';
  };

  const startDisabled =
    scenarioLoading ||
    vocabularyLoading ||
    stepsLoading ||
    !scenarioId ||
    scenarioSteps.length === 0;

  const buddyPosition = { left: '76%', top: '58%' };
  const buddy3DPosition = [1.5, -1.2, 1.5];

  return (
    <div className="restaurant-container app-shell">
      <BackgroundMusic src={bgMusicSrc} volume={0.2} />
      <AdventureScene
        gameState={gameState === 'not-started' ? 'not-started' : 'idle-at-table'}
        onArrivedAtTable={() => { }}
        buddyPosition={buddy3DPosition}
        buddyScale={0.6}
      />

      <header className="hud-header">
        <div className="hud-title-container">
          <span className="hud-title-forest">{scenario?.worldName || 'Food Forest'}</span>
          <span className="hud-title-level">{scenario?.title || 'Family Restaurant'}</span>
        </div>
        <div className="hud-stats-container">
          <div className="stat-card">
            <span className="stat-icon">🌟</span>
            <span className="xp-color">XP: {xp}</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🪙</span>
            <span className="coin-color">Xu: {coins}</span>
          </div>
          {gameState === 'ordering' && orderingSteps.length > 0 && (
            <div className="stat-card rest-step-badge">
              <span>
                Bước {activeOrderIndex + 1} / {orderingSteps.length}
              </span>
            </div>
          )}
        </div>
      </header>

      <div className="rest-scene-elements">
        <div className="rest-counter">
          <img src={orderPerson} alt="Waiter" className="rest-waiter-img" />

          {gameState === 'ordering' && isOrderStep(activeStep) && !waiterClicked && (
            <button
              type="button"
              className="rest-waiter-hotspot animate-pulse"
              onClick={() => {
                setWaiterClicked(true);
                setFeedbackMessage(activeStep?.buddyMessage || 'Hãy gọi món bằng tiếng Anh nhé!');
              }}
              aria-label="Gọi món với nhân viên"
            />
          )}
        </div>

        <div className="rest-menu-panel">
          <img src={menuImg} alt="Menu" className="rest-menu-img" />
        </div>
      </div>

      {gameState === 'ordering' && (
        <div className="rest-gameplay-area">
          <RestaurantProgress
            steps={orderingSteps}
            currentIndex={activeOrderIndex}
            completedIndexes={completedStepIndexes}
          />
        </div>
      )}

      {gameState === 'ordering' && isOrderStep(activeStep) && waiterClicked && expectedSentence && (
        <div className="rest-voice-panel">
          <div className="rest-voice-panel__header">
            <span className="rest-voice-panel__icon">🗣️</span>
            <h2 className="rest-voice-panel__title">Order in English</h2>
          </div>
          <VoiceMission
            expectedSentence={expectedSentence}
            scenarioId={scenarioId}
            stepOrder={activeStep?.stepOrder}
            onSuccess={handleVoiceSuccess}
            onFail={handleVoiceFail}
            disabled={stepLocked || gameState !== 'ordering'}
            returnLabel="Continue ordering"
            successHint={activeStep?.successResponse || ''}
          />
        </div>
      )}

      <div className="mission-panel-toggle-wrapper">
        <button
          className="mission-toggle-btn"
          onClick={() => setMissionPanelVisible((prev) => !prev)}
          type="button"
        >
          {missionPanelVisible ? 'Ẩn bảng nhiệm vụ' : 'Hiện bảng nhiệm vụ'}
        </button>
      </div>

      {missionPanelVisible && (
        <MissionPanel
          gameState={
            gameState === 'not-started'
              ? 'not-started'
              : gameState === 'completed'
                ? 'completed'
                : 'idle-at-table'
          }
          title={scenario?.title || 'Family Restaurant'}
          description={scenario?.description}
          onStartMission={handleStartMission}
          instruction={getMissionInstruction()}
          loading={scenarioLoading || vocabularyLoading || stepsLoading}
          error={scenarioError || vocabularyError || stepsError}
          startDisabled={startDisabled}
        />
      )}

      {/* <OrderFeedbackPopup
        show={feedbackPopup.show}
        type={feedbackPopup.type}
        message={feedbackPopup.message}
        onClose={handleDismissFailurePopup}
      /> */}

      {gameState !== 'not-started' && (
        <SpeechBubble
          gameState={gameState === 'completed' ? 'completed' : 'idle-at-table'}
          message={feedbackMessage}
          buddyPosition={buddyPosition}
          scenarioDescription={activeStep?.buddyMessage || scenario?.description}
        />
      )}

      <button
        className="back-to-map-btn"
        onClick={() => navigate('/adventure/food-forest')}
        type="button"
      >
        Quay lại bản đồ
      </button>

      <RewardPopup
        show={showReward}
        xpReward={xp}
        coinReward={coins}
        onClose={() => {
          setShowReward(false);
          navigate('/adventure/food-forest');
        }}
      />
    </div>
  );
}
