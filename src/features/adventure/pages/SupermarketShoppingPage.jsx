import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import AdventureScene from '../components/AdventureScene';
import MissionPanel from '../components/MissionPanel';
import SpeechBubble from '../components/SpeechBubble';
import RewardPopup from '../components/RewardPopup';
import ShoppingCounter from '../components/ShoppingCounter';
import ShoppingChecklist from '../components/ShoppingChecklist';
import VoiceMission from '../components/VoiceMission';

import useScenarioSteps from '../hooks/useScenarioSteps';
import useScenarioVocabulary from '../hooks/useScenarioVocabulary';
import learningService from '../services/learningService';
import profileService from '../services/profileService';
import progressService from '../services/progressService';
import { useAuthStore } from '../../auth/store/authStore';
import '../styles/SupermarketShoppingPage.css';
import supamarket2 from '../../../assets/supamarket2.png';
import fridge from '../../../assets/fridge.png';
import fruitCounter from '../../../assets/fruit_counter.png';
import foodCounter from '../../../assets/food_counter.png';
import counterPerson from '../../../assets/counterperson.png';
import supermarketMini from '../../../assets/mini-1/supermarket.png';


// ─── Image resolution (same pattern as KitchenAdventurePage) ─────────────────
const vocabularyImages = import.meta.glob('../../../assets/images/*', {
  eager: true,
  import: 'default',
  query: '?url',
});

const resolveVocabularyImage = (imageUrl) => {
  if (!imageUrl) return '';
  if (/^(https?:)?\/\//.test(imageUrl) || imageUrl.startsWith('data:')) return imageUrl;
  const filename = imageUrl.split('/').pop();
  const key = Object.keys(vocabularyImages).find((k) => k.endsWith(`/${filename}`));
  return key ? vocabularyImages[key] : imageUrl;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const normalise = (v = '') => v.trim().toLowerCase().replace(/\s+/g, '-');

const toShopItem = (vocabulary) => ({
  id: normalise(vocabulary.word || vocabulary.id),
  label: vocabulary.word,
  meaning: vocabulary.meaning,
  image: resolveVocabularyImage(vocabulary.imageUrl),
  alt: vocabulary.word,
  vocabulary,
});

// ─── Step-routing constants (match backend expectedEntity values exactly) ─────
const ENTITY_VEGETABLES = 'VEGETABLES';
const ENTITY_SNACK_DAIRY = 'SNACK_DAIRY';
const ENTITY_MEAT_COUNTER = 'MEAT_COUNTER'; // voice step
const ENTITY_MEAT = 'MEAT';
const INTENT_MISSION_COMPLETE = 'MISSION_COMPLETE';

// ─── Which vocabulary words belong to each shopping category ─────────────────
// Source: FoodForestSeeder – vocabulary grouped by step requirement
const VEGETABLE_WORDS = new Set(['broccoli', 'cucumber', 'potato', 'onion']);
const DAIRY_SNACK_WORDS = new Set(['cheese', 'yogurt', 'butter', 'crackers']);
const MEAT_WORDS = new Set(['chicken', 'beef', 'pork']);

const getCategoryWords = (entity) => {
  if (entity === ENTITY_VEGETABLES) return VEGETABLE_WORDS;
  if (entity === ENTITY_SNACK_DAIRY) return DAIRY_SNACK_WORDS;
  if (entity === ENTITY_MEAT) return MEAT_WORDS;
  return new Set();
};

// ─── Asset paths ──────────────────────────────────────────────────────────────
// These live in /public or /assets and are resolved via plain string paths
const BG_SUPERMARKET = supamarket2;
const BG_VEGETABLE_COUNTER = fruitCounter;
const BG_FRIDGE = fridge;
const BG_MEAT_COUNTER = foodCounter;

// ─── Supermarket Hotspots for approach phase ────────────────────────────────
const SUPERMARKET_HOTSPOTS = {
  VEGETABLES: { left: '18%', top: '45%', width: '22%', height: '30%', label: 'Quầy rau củ' },
  SNACK_DAIRY: { left: '50%', top: '42%', width: '17%', height: '42%', label: 'Tủ lạnh đồ ăn nhẹ' },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function SupermarketShoppingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const routeScenario = location.state?.scenario;
  const scenarioId = routeScenario?.id || searchParams.get('scenarioId');

  // ── API data ──
  const { steps: scenarioSteps, loading: stepsLoading, error: stepsError } = useScenarioSteps(scenarioId);
  const { vocabularies, loading: vocabularyLoading, error: vocabularyError } = useScenarioVocabulary(scenarioId);
  const [scenario, setScenario] = useState(routeScenario || null);
  const [scenarioLoading, setScenarioLoading] = useState(!routeScenario && Boolean(scenarioId));
  const [scenarioError, setScenarioError] = useState('');

  useEffect(() => {
    if (routeScenario || !scenarioId) return undefined;
    let ignore = false;
    const load = async () => {
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
    load();
    return () => { ignore = true; };
  }, [routeScenario, scenarioId]);

  // ── Game state ──
  const [gameState, setGameState] = useState('not-started');
  const [missionStage, setMissionStage] = useState(0);
  const [collectedIds, setCollectedIds] = useState(new Set());
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showReward, setShowReward] = useState(false);
  const [missionPanelVisible, setMissionPanelVisible] = useState(true);
  const [xp, setXp] = useState(80);
  const [coins, setCoins] = useState(20);
  const [isCounterVisible, setIsCounterVisible] = useState(false);
  const { childProfile, loadChildProfile } = useAuthStore();
  const [isCounterPersonClicked, setIsCounterPersonClicked] = useState(false);
  const [evaluationDone, setEvaluationDone] = useState(false);
  const [voiceMatched, setVoiceMatched] = useState(false);

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

  // ── Reset counter visibility on step change ──
  useEffect(() => {
    setIsCounterVisible(false);
    setIsCounterPersonClicked(false);
  }, [missionStage]);

  // ── Derived step data ──
  const activeStep = scenarioSteps[missionStage] ?? null;

  // ── All vocabulary as shop items ──
  const allShopItems = useMemo(() => vocabularies.map(toShopItem), [vocabularies]);

  // ── Filter items for current step ──
  const { correctItems, wrongItems } = useMemo(() => {
    if (!activeStep) return { correctItems: [], wrongItems: [] };
    const entity = activeStep.expectedEntity;
    const categoryWords = getCategoryWords(entity);

    const correct = allShopItems.filter((item) =>
      categoryWords.has(item.id) || categoryWords.has(normalise(item.label)),
    );
    const wrong = allShopItems.filter(
      (item) =>
        !categoryWords.has(item.id) &&
        !categoryWords.has(normalise(item.label)) &&
        !correct.some((c) => c.id === item.id),
    );
    return { correctItems: correct, wrongItems: wrong };
  }, [activeStep, allShopItems]);

  // ── Checklist items for the current step ──
  const checklistItems = useMemo(
    () => correctItems.map(({ id, label }) => ({ id, label })),
    [correctItems],
  );

  // ── Auto-advance when all required items collected ──
  useEffect(() => {
    if (!activeStep || correctItems.length === 0) return;
    const allCollected = correctItems.every((item) => collectedIds.has(item.id));
    if (!allCollected) return;

    const nextStep = scenarioSteps[missionStage + 1];
    if (!nextStep) return;

    const timer = setTimeout(() => {
      setFeedbackMessage(activeStep.successResponse || 'Tuyệt vời!');
      setCollectedIds(new Set());
      setMissionStage((prev) => prev + 1);
    }, 600);

    return () => clearTimeout(timer);
  }, [collectedIds, correctItems, activeStep, missionStage, scenarioSteps]);

  // ── Detect mission complete step ──
  useEffect(() => {
    if (activeStep?.expectedIntent === INTENT_MISSION_COMPLETE && gameState === 'shopping') {
      setGameState('completed');
      setFeedbackMessage(activeStep.successResponse || 'Hoàn thành nhiệm vụ!');
      setShowReward(true);
    }
  }, [activeStep, gameState]);

  // ── Handlers ──
  const handleStartMission = () => {
    if (gameState !== 'not-started') return;
    setMissionStage(0);
    setCollectedIds(new Set());
    setShowReward(false);
    setGameState('shopping');
    setFeedbackMessage(scenarioSteps[0]?.buddyMessage || scenario?.description || '');
  };

  const handleCorrectItem = (itemId) => {
    setCollectedIds((prev) => new Set([...prev, itemId]));
    const picked = correctItems.find((i) => i.id === itemId);
    setFeedbackMessage(`Tuyệt! Bạn đã chọn ${picked?.label || itemId}! ✅`);
  };

  const handleWrongItem = (itemId) => {
    const item = allShopItems.find((i) => i.id === itemId);
    setFeedbackMessage(
      activeStep?.failResponse || `${item?.label || itemId} không có trong danh sách lúc này!`,
    );
  };

  const handleVoiceSuccess = () => {
    setFeedbackMessage(activeStep?.successResponse || 'Tuyệt! Giờ mình biết phải đi đâu rồi.');
    const nextStep = scenarioSteps[missionStage + 1];
    if (nextStep) {
      setCollectedIds(new Set());
      setMissionStage((prev) => prev + 1);
      setFeedbackMessage(nextStep.buddyMessage || activeStep?.successResponse || '');
    }
  };

  const handleVoiceFail = (transcript) => {
    setFeedbackMessage(
      activeStep?.failResponse || "Hãy thử nói: 'Excuse me, where is the meat counter?'",
    );
  };

  const handleEvaluateFeedback = (data) => {
    const parts = []
    if (data.overallFeedback) parts.push(data.overallFeedback)
    if (data.strengths?.length) {
      parts.push('\n💪 Điểm mạnh:')
      data.strengths.forEach((s) => parts.push(`  • ${s}`))
    }
    if (data.weaknesses?.length) {
      parts.push('\n🎯 Cần cải thiện:')
      data.weaknesses.forEach((w) => parts.push(`  • ${w}`))
    }
    if (data.improvementTips?.length) {
      parts.push('\n📝 Mẹo:')
      data.improvementTips.forEach((t) => parts.push(`  • ${t}`))
    }
    if (data.wordFeedback?.length) {
      parts.push('\n📖 Từng từ:')
      data.wordFeedback.forEach((w) => {
        parts.push(`  • "${w.word}": ${w.problem}`)
        if (w.tip) parts.push(`    Mẹo: ${w.tip}`)
      })
    }

    setVoiceMatched(!!data.matched)
    setFeedbackMessage(parts.join('\n'))
    setEvaluationDone(true)
  };

  const handleRetry = () => {
    setEvaluationDone(false);
    setVoiceMatched(false);
    setFeedbackMessage('');
  };

  const handleContinue = () => {
    setEvaluationDone(false);
    setVoiceMatched(false);
    setFeedbackMessage('');
    const nextStep = scenarioSteps[missionStage + 1];
    if (nextStep) {
      setCollectedIds(new Set());
      setMissionStage((prev) => prev + 1);
    }
  };

  // ── Step-type detection helpers ──
  const isCollectStep =
    activeStep?.expectedIntent === 'COLLECT_CATEGORY' &&
    activeStep?.expectedEntity !== ENTITY_MEAT_COUNTER;

  const isVoiceStep =
    activeStep?.expectedIntent === 'ASK_LOCATION' &&
    activeStep?.expectedEntity === ENTITY_MEAT_COUNTER;


  // const isMissionComplete = activeStep?.expectedIntent === INTENT_MISSION_COMPLETE;

  // ── Counter background by entity ──
  const counterBackground = useMemo(() => {
    const entity = activeStep?.expectedEntity;
    if (entity === ENTITY_VEGETABLES) return BG_VEGETABLE_COUNTER;
    if (entity === ENTITY_SNACK_DAIRY) return BG_FRIDGE;
    if (entity === ENTITY_MEAT) return BG_MEAT_COUNTER;
    return BG_SUPERMARKET;
  }, [activeStep]);

  // ── MissionPanel instruction ──
  const getMissionInstruction = () => {
    const anyLoading = scenarioLoading || vocabularyLoading || stepsLoading;
    const anyError = scenarioError || vocabularyError || stepsError;
    if (anyLoading) return 'Đang tải dữ liệu nhiệm vụ…';
    if (anyError) return anyError;
    if (!scenarioId) return 'Chọn một kịch bản để bắt đầu.';
    if (gameState === 'not-started') return scenario?.description || "Nhấn 'Bắt đầu nhiệm vụ' để bắt đầu.";
    return activeStep?.buddyMessage || 'Hoàn thành bước nhiệm vụ hiện tại.';
  };

  const startDisabled =
    scenarioLoading ||
    vocabularyLoading ||
    stepsLoading ||
    !scenarioId ||
    scenarioSteps.length === 0;

  // ── Buddy 3D position (fixed in corner for supermarket) ──
  const buddyPosition = { left: '70%', top: '56%' };
  const buddy3DPosition = [1.3, -1.2, 1.5];

  return (
    <div className="supermarket-container app-shell">
      {/* ── 3D Buddy character ── */}
      <AdventureScene
        gameState={gameState === 'not-started' ? 'not-started' : 'idle-at-table'}
        onArrivedAtTable={() => { }}
        buddyPosition={buddy3DPosition}
        buddyScale={0.6}
      />

      {/* ── Intro Story Panel (shown before game starts) ── */}
      {gameState === 'not-started' && (
        <div className="sm-intro-overlay">
          <div className="sm-intro-label">
            <span className="sm-intro-label__icon">🔍</span>
            <span>Adventure 2 – Supermarket Shopping</span>
          </div>

          <div className="sm-intro-manga-grid">
            <img
              src={supermarketMini}
              alt="Supermarket story panel"
              className="sm-intro-manga-panel"
              draggable={false}
            />
          </div>

          <button
            type="button"
            className="sm-intro-start-btn"
            onClick={handleStartMission}
            disabled={startDisabled}
          >
            <span className="sm-intro-start-btn__icon">🛒</span>
            <span>Let&apos;s Start!</span>
            <span className="sm-intro-start-btn__arrow">🚀</span>
          </button>

          <button
            type="button"
            className="sm-intro-back-link"
            onClick={() => navigate('/adventure/food-forest')}
          >
            ← Back to map
          </button>
        </div>
      )}

      {/* ── HUD Header ── */}
      <header className="hud-header">
        <div className="hud-title-container">
          <span className="hud-title-forest">{scenario?.worldName || 'Food Forest'}</span>
          <span className="hud-title-level">{scenario?.title || 'Mua sắm siêu thị'}</span>
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
          {gameState === 'shopping' && activeStep && (
            <div className="stat-card sm-step-badge">
              <span>Bước {missionStage + 1} / {scenarioSteps.length - 1}</span>
            </div>
          )}
        </div>
      </header>

      {/* ── Main gameplay area ── */}
      {gameState === 'shopping' && (
        <div className="sm-gameplay-area">
          {/* Cashier / Counter Person (always visible on background during play) */}
          <div
            className="counter-person-container"
            style={{
              position: 'absolute',
              left: '78%',
              top: '51%',
              zIndex: 5,
              pointerEvents: 'none',
            }}
          >
            <img
              src={counterPerson}
              alt="Nhân viên quầy"
              className="counter-person-img"
            />
          </div>

          {/* Approach phase: click area in supermarket room */}
          {isCollectStep && !isCounterVisible && SUPERMARKET_HOTSPOTS[activeStep?.expectedEntity] && (
            <button
              type="button"
              className="supermarket-target-hotspot animate-pulse"
              style={{
                left: SUPERMARKET_HOTSPOTS[activeStep.expectedEntity].left,
                top: SUPERMARKET_HOTSPOTS[activeStep.expectedEntity].top,
                width: SUPERMARKET_HOTSPOTS[activeStep.expectedEntity].width,
                height: SUPERMARKET_HOTSPOTS[activeStep.expectedEntity].height,
              }}
              onClick={() => {
                setIsCounterVisible(true);
                setFeedbackMessage(`Hãy tìm các món cần thiết ở đây!`);
              }}
              aria-label={`Đi đến ${SUPERMARKET_HOTSPOTS[activeStep.expectedEntity].label}`}
            >
              <span className="supermarket-target-hotspot__hint">🔍 Mở quầy</span>
            </button>
          )}

          {/* Step 3: Click counter person to talk */}
          {isVoiceStep && !isCounterPersonClicked && !evaluationDone && (
            <button
              type="button"
              className="supermarket-target-hotspot animate-pulse"
              style={{
                left: '82%',
                top: '48%',
                width: '12%',
                height: '24%',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'flex-start'

              }}
              onClick={() => {
                setIsCounterPersonClicked(true);
                setFeedbackMessage("Hãy hỏi nhân viên quầy khu vực thịt ở đâu!");
              }}
              aria-label="Nói chuyện với nhân viên thu ngân"
            >
              {/* <span className="supermarket-target-hotspot__hint">💬 Hỏi nhân viên</span> */}
            </button>
          )}

          {/* Step 4: Pulsing arrow pointing to the left to approach meat counter */}
          {activeStep?.expectedEntity === 'MEAT' && !isCounterVisible && (
            <button
              type="button"
              className="supermarket-target-hotspot animate-pulse sm-left-arrow-btn"
              style={{
                left: '10%',
                top: '55%',
                width: '12%',
                height: '12%',
                borderRadius: '50%',
                background: 'rgba(59, 130, 246, 0.25)',
                borderColor: '#2563eb',
              }}
              onClick={() => {
                setIsCounterVisible(true);
                setFeedbackMessage("Đây là quầy thịt! Hãy lấy chicken, beef và pork.");
              }}
              aria-label="Đến gần quầy thịt"
            >
              <span style={{ fontSize: '32px', display: 'inline-block', animation: 'sm-bounce-left 0.8s infinite alternate' }}>⬅️</span>
            </button>
          )}

          {/* Active shopping counter / fridge / shelf */}
          {isCollectStep && isCounterVisible && (
            <ShoppingCounter
              backgroundImage={counterBackground}
              backgroundAlt={activeStep.expectedEntity}
              sceneKey={activeStep.expectedEntity}
              correctItems={correctItems}
              wrongItems={wrongItems}
              collectedIds={collectedIds}
              onCorrect={handleCorrectItem}
              onWrong={handleWrongItem}
              onReturn={() => setIsCounterVisible(false)}
            />
          )}

          {/* Voice mission panel (acts as modal popup with return button) */}
          {isVoiceStep && isCounterPersonClicked && !evaluationDone && (
            <div className="sm-voice-panel">
              <button
                type="button"
                className="shopping-scene__return-btn"
                onClick={() => setIsCounterPersonClicked(false)}
                style={{ top: '15px', left: '15px' }}
              >
                Quay lại siêu thị ↩️
              </button>
              <div className="sm-voice-panel__header" style={{ marginTop: '20px' }}>
                <span className="sm-voice-panel__icon">🗣️</span>
                <h2 className="sm-voice-panel__title">Hỏi đường đi</h2>
              </div>
              <VoiceMission
                expectedSentence="excuse me, where is the meat counter"
                scenarioId={scenarioId}
                stepOrder={activeStep?.stepOrder}
                onSuccess={handleVoiceSuccess}
                onFail={handleVoiceFail}
                onEvaluate={handleEvaluateFeedback}
                disabled={gameState !== 'shopping'}
              />
            </div>

          )}
          {/* Checklist sidebar (only when counter is open) */}
          {isCollectStep && isCounterVisible && (
            <div className="sm-checklist-wrapper">
              <ShoppingChecklist
                items={checklistItems}
                collectedIds={collectedIds}
                title="🛒 Danh sách mua sắm"
              />
            </div>
          )}
        </div>
      )}

      {/* ── Mission Panel ── */}
      {gameState !== 'not-started' && (
        <div className="mission-panel-toggle-wrapper">
          <button
            className="mission-toggle-btn"
            onClick={() => setMissionPanelVisible((p) => !p)}
            type="button"
          >
            {missionPanelVisible ? 'Ẩn bảng nhiệm vụ' : 'Hiện bảng nhiệm vụ'}
          </button>
        </div>
      )}

      {gameState !== 'not-started' && missionPanelVisible && (
        <MissionPanel
          gameState={
            gameState === 'not-started'
              ? 'not-started'
              : gameState === 'completed'
                ? 'completed'
                : 'idle-at-table'
          }
          title={scenario?.title || 'Mua sắm siêu thị'}
          description={scenario?.description}
          onStartMission={handleStartMission}
          instruction={getMissionInstruction()}
          loading={scenarioLoading || vocabularyLoading || stepsLoading}
          error={scenarioError || vocabularyError || stepsError}
          startDisabled={startDisabled}
        />
      )}

      {/* ── Evaluation feedback panel ── */}
      {evaluationDone && feedbackMessage && (
        <div className="sm-evaluation-panel">
          <div className="sm-evaluation-feedback">
            {feedbackMessage.split('\n').map((line, i) => (
              <p key={i} className="sm-evaluation-line">{line}</p>
            ))}
          </div>
          <div className="sm-evaluation-actions">
            {!voiceMatched && (
              <button
                type="button"
                className="sm-evaluation-btn sm-evaluation-btn--retry"
                onClick={handleRetry}
              >
                Thử lại
              </button>
            )}
            <button
              type="button"
              className="sm-evaluation-btn sm-evaluation-btn--continue"
              onClick={handleContinue}
            >
              {voiceMatched ? 'Tiếp tục' : 'Bỏ qua'}
            </button>
          </div>
        </div>
      )}

      {/* ── Speech bubble ── */}
      {gameState !== 'not-started' && !evaluationDone && (
        <SpeechBubble
          gameState={gameState === 'completed' ? 'completed' : 'idle-at-table'}
          message={feedbackMessage}
          buddyPosition={buddyPosition}
          scenarioDescription={activeStep?.buddyMessage || scenario?.description}
        />
      )}

      {/* ── Back to map ── */}
      <button
        className="back-to-map-btn"
        onClick={() => navigate('/adventure/food-forest')}
        type="button"
      >
        Quay lại bản đồ
      </button>

      {/* ── Reward Popup ── */}
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
