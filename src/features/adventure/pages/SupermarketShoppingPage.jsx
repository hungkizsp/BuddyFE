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
import '../styles/SupermarketShoppingPage.css';
import supamarket2 from '../../../assets/supamarket2.png';
import fridge from '../../../assets/fridge.png';
import fruitCounter from '../../../assets/fruit_counter.png';
import foodCounter from '../../../assets/food_counter.png';
import counterPerson from '../../../assets/counterperson.png';


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
  VEGETABLES: { left: '18%', top: '45%', width: '22%', height: '30%', label: 'Vegetable Counter' },
  SNACK_DAIRY: { left: '50%', top: '42%', width: '17%', height: '42%', label: 'Snack Fridge' },
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
        if (!ignore) setScenarioError(err.message || 'Unable to load scenario.');
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
  const [xp] = useState(80);
  const [coins] = useState(20);
  const [isCounterVisible, setIsCounterVisible] = useState(false);
  const [isCounterPersonClicked, setIsCounterPersonClicked] = useState(false);

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
      setFeedbackMessage(activeStep.successResponse || 'Great job!');
      setCollectedIds(new Set());
      setMissionStage((prev) => prev + 1);
    }, 600);

    return () => clearTimeout(timer);
  }, [collectedIds, correctItems, activeStep, missionStage, scenarioSteps]);

  // ── Detect mission complete step ──
  useEffect(() => {
    if (activeStep?.expectedIntent === INTENT_MISSION_COMPLETE && gameState === 'shopping') {
      setGameState('completed');
      setFeedbackMessage(activeStep.successResponse || 'Mission Complete!');
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
    setFeedbackMessage(`Great! You picked up ${picked?.label || itemId}! ✅`);
  };

  const handleWrongItem = (itemId) => {
    const item = allShopItems.find((i) => i.id === itemId);
    setFeedbackMessage(
      activeStep?.failResponse || `${item?.label || itemId} is not on the list right now!`,
    );
  };

  const handleVoiceSuccess = () => {
    setFeedbackMessage(activeStep?.successResponse || 'Great! Now we know where to go.');
    const nextStep = scenarioSteps[missionStage + 1];
    if (nextStep) {
      setCollectedIds(new Set());
      setMissionStage((prev) => prev + 1);
      setFeedbackMessage(nextStep.buddyMessage || activeStep?.successResponse || '');
    }
  };

  const handleVoiceFail = (transcript) => {
    setFeedbackMessage(
      activeStep?.failResponse || "Try saying: 'Excuse me, where is the meat counter?'",
    );
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
    if (anyLoading) return 'Loading mission data…';
    if (anyError) return anyError;
    if (!scenarioId) return 'Choose a scenario to begin.';
    if (gameState === 'not-started') return scenario?.description || "Click 'Start Mission' to begin.";
    return activeStep?.buddyMessage || 'Complete the current mission step.';
  };

  const startDisabled =
    scenarioLoading ||
    vocabularyLoading ||
    stepsLoading ||
    !scenarioId ||
    scenarioSteps.length === 0;

  // ── Buddy 3D position (fixed in corner for supermarket) ──
  const buddyPosition = { left: '70%', top: '65%' };
  const buddy3DPosition = [1.5, -1.2, 1.5];

  return (
    <div className="supermarket-container">
      {/* ── 3D Buddy character ── */}
      <AdventureScene
        gameState={gameState === 'not-started' ? 'not-started' : 'idle-at-table'}
        onArrivedAtTable={() => { }}
        buddyPosition={buddy3DPosition}
        buddyScale={0.6}
      />

      {/* ── HUD Header ── */}
      <header className="hud-header">
        <div className="hud-title-container">
          <span className="hud-title-forest">{scenario?.worldName || 'Food Forest'}</span>
          <span className="hud-title-level">{scenario?.title || 'Supermarket Shopping'}</span>
        </div>
        <div className="hud-stats-container">
          <div className="stat-card">
            <span className="stat-icon">🌟</span>
            <span className="xp-color">XP: {xp}</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🪙</span>
            <span className="coin-color">Coins: {coins}</span>
          </div>
          {gameState === 'shopping' && activeStep && (
            <div className="stat-card sm-step-badge">
              <span>Step {missionStage + 1} / {scenarioSteps.length - 1}</span>
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
              alt="Counter Person"
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
                setFeedbackMessage(`Let's find the required items here!`);
              }}
              aria-label={`Go to ${SUPERMARKET_HOTSPOTS[activeStep.expectedEntity].label}`}
            >
              <span className="supermarket-target-hotspot__hint">🔍 Open Counter</span>
            </button>
          )}

          {/* Step 3: Click counter person to talk */}
          {isVoiceStep && !isCounterPersonClicked && (
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
                setFeedbackMessage("Ask the counter person where the meat section is!");
              }}
              aria-label="Talk to cashier"
            >
              <span className="supermarket-target-hotspot__hint">💬 Ask Staff</span>
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
                setFeedbackMessage("Here is the meat counter! Let's get chicken, beef, and pork.");
              }}
              aria-label="Approach Meat Counter"
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
          {isVoiceStep && isCounterPersonClicked && (
            <div className="sm-voice-panel">
              <button
                type="button"
                className="shopping-scene__return-btn"
                onClick={() => setIsCounterPersonClicked(false)}
                style={{ top: '15px', left: '15px' }}
              >
                Return to Supermarket ↩️
              </button>
              <div className="sm-voice-panel__header" style={{ marginTop: '20px' }}>
                <span className="sm-voice-panel__icon">🗣️</span>
                <h2 className="sm-voice-panel__title">Ask for Directions</h2>
              </div>
              <VoiceMission
                expectedSentence="excuse me, where is the meat counter"
                onSuccess={handleVoiceSuccess}
                onFail={handleVoiceFail}
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
                title="🛒 Shopping List"
              />
            </div>
          )}
        </div>
      )}

      {/* ── Mission Panel ── */}
      <div className="mission-panel-toggle-wrapper">
        <button
          className="mission-toggle-btn"
          onClick={() => setMissionPanelVisible((p) => !p)}
          type="button"
        >
          {missionPanelVisible ? 'Hide Mission Panel' : 'Show Mission Panel'}
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
          title={scenario?.title || 'Supermarket Shopping'}
          description={scenario?.description}
          onStartMission={handleStartMission}
          instruction={getMissionInstruction()}
          loading={scenarioLoading || vocabularyLoading || stepsLoading}
          error={scenarioError || vocabularyError || stepsError}
          startDisabled={startDisabled}
        />
      )}

      {/* ── Speech bubble ── */}
      {gameState !== 'not-started' && (
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
        Back to Map
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
