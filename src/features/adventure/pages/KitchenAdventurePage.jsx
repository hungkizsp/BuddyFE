import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import AdventureScene from "../components/AdventureScene";
import DraggableItem from "../components/DraggableItem";
import SpeechBubble from "../components/SpeechBubble";
import MissionPanel from "../components/MissionPanel";
import RewardPopup from "../components/RewardPopup";
import useScenarioSteps from "../hooks/useScenarioSteps";
import useScenarioVocabulary from "../hooks/useScenarioVocabulary";
import learningService from "../services/learningService";
import "../styles/KitchenAdventurePage.css";

const normalizeWord = (value = "") =>
  value.trim().toLowerCase().replace(/\s+/g, "-");
const vocabularyImages = import.meta.glob("../../../assets/images/*", {
  eager: true,
  import: "default",
  query: "?url",
});

const resolveVocabularyImage = (imageUrl) => {
  if (!imageUrl) return "";
  if (/^(https?:)?\/\//.test(imageUrl) || imageUrl.startsWith("data:"))
    return imageUrl;

  const filename = imageUrl.split("/").pop();
  const localImageKey = Object.keys(vocabularyImages).find((key) =>
    key.endsWith(`/${filename}`),
  );

  return localImageKey ? vocabularyImages[localImageKey] : imageUrl;
};

const ITEM_POSITIONS = [
  { left: "12%", top: "20%" },
  { left: "36%", top: "10%" },
  { left: "44%", top: "12%" },
  { left: "64%", top: "60%" },
  { left: "47%", top: "48%" },
  { left: "74%", top: "60%" },
];

const findVocabulary = (items, expectedWord) =>
  items.find((item) => item.id === normalizeWord(expectedWord));

const entityToItemId = (entity = "") =>
  normalizeWord(entity.replaceAll("_", " "));

const toDraggableItem = (vocabulary) => ({
  id: normalizeWord(vocabulary.word || vocabulary.id),
  label: vocabulary.word,
  meaning: vocabulary.meaning,
  image: resolveVocabularyImage(vocabulary.imageUrl),
  alt: vocabulary.word,
  exampleSentence: vocabulary.exampleSentence,
  vocabulary,
});

export default function KitchenAdventurePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const routeScenario = location.state?.scenario;
  const scenarioId = routeScenario?.id || searchParams.get("scenarioId");

  const {
    steps: scenarioSteps,
    loading: stepsLoading,
    error: stepsError,
  } = useScenarioSteps(scenarioId);
  const {
    vocabularies,
    loading: vocabularyLoading,
    error: vocabularyError,
  } = useScenarioVocabulary(scenarioId);
  const [scenario, setScenario] = useState(routeScenario || null);
  const [scenarioLoading, setScenarioLoading] = useState(
    !routeScenario && Boolean(scenarioId),
  );
  const [scenarioError, setScenarioError] = useState("");

  const [gameState, setGameState] = useState("not-started");
  const [tableItems, setTableItems] = useState([]);
  const [missionStage, setMissionStage] = useState(0);
  const [preparedEggOnToast, setPreparedEggOnToast] = useState(false);
  const [potContents, setPotContents] = useState([]);
  const [buddyPosition, setBuddyPosition] = useState({
    left: "67%",
    top: "47%",
  });
  const [isDraggingBuddy, setIsDraggingBuddy] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [missionPanelVisible, setMissionPanelVisible] = useState(true);
  const [xp, setXp] = useState(60);
  const [coins, setCoins] = useState(15);
  const [showRewards, setShowRewards] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const buddyDragStartRef = useRef({ x: 0, y: 0, left: 0, top: 0 });

  useEffect(() => {
    if (routeScenario || !scenarioId) return undefined;

    let ignore = false;

    const loadScenario = async () => {
      try {
        setScenarioLoading(true);
        setScenarioError("");
        const data = await learningService.getScenario(scenarioId);
        if (!ignore) setScenario(data);
      } catch (err) {
        if (!ignore)
          setScenarioError(err.message || "Unable to load scenario.");
      } finally {
        if (!ignore) setScenarioLoading(false);
      }
    };

    loadScenario();

    return () => {
      ignore = true;
    };
  }, [routeScenario, scenarioId]);

  const vocabularyItems = useMemo(
    () => vocabularies.map(toDraggableItem),
    [vocabularies],
  );

  const itemsByWord = useMemo(
    () => ({
      apple: findVocabulary(vocabularyItems, "apple"),
      bread: findVocabulary(vocabularyItems, "bread"),
      egg: findVocabulary(vocabularyItems, "egg"),
      milk: findVocabulary(vocabularyItems, "milk"),
      banana: findVocabulary(vocabularyItems, "banana"),
      toast: findVocabulary(vocabularyItems, "toast"),
      eggOnToast: findVocabulary(vocabularyItems, "egg on toast"),
    }),
    [vocabularyItems],
  );

  const BREAD_ID = "bread";
  const EGG_ID = "egg";
  const EGG_ON_TOAST_ID = "egg-on-toast";
  const activeStep = scenarioSteps[missionStage];
  const nextStep = scenarioSteps[missionStage + 1];

  const initialTableItems = useMemo(
    () =>
      vocabularyItems.filter((item) => {
        const id = normalizeWord(item.label);
        return id !== "apple" && id !== "egg-on-toast";
      }),
    [vocabularyItems],
  );

  const resetMission = () => {
    setTableItems(initialTableItems);
    setMissionStage(0);
    setPreparedEggOnToast(false);
    setPotContents([]);
    setBuddyPosition({ left: "47%", top: "55%" });
    setFeedbackMessage(
      scenarioSteps[0]?.buddyMessage ||
        scenario?.description ||
        "Buddy is ready for this mission.",
    );
    setShowRewards(false);
  };

  const handleStartMission = () => {
    if (gameState === "not-started" && initialTableItems.length > 0) {
      resetMission();
      setGameState("walking-to-table");
      setFeedbackMessage(
        scenarioSteps[0]?.buddyMessage ||
          scenario?.description ||
          "Buddy is walking to the kitchen table.",
      );
    }
  };

  const handleArrivedAtTable = () => {
    if (gameState === "walking-to-table") {
      setGameState("idle-at-table");
    }
  };

  const removeItem = (itemId) => {
    setTableItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleDropOnBuddy = (itemId) => {
    if (gameState !== "idle-at-table") return;

    const item = tableItems.find((tableItem) => tableItem.id === itemId);
    const word = item?.label || itemId;
    const expectedItemId = entityToItemId(activeStep?.expectedEntity);

    if (itemId === itemsByWord.banana?.id) {
      setFeedbackMessage(
        activeStep?.failResponse || `Buddy does not want ${word} right now.`,
      );
      return;
    }

    if (itemId === BREAD_ID || itemId === EGG_ID){
      setFeedbackMessage(
        activeStep?.failResponse ||
          `Buddy wants ${itemsByWord.eggOnToast?.label || "the prepared food"}, not ${word} alone.`,
      );
      return;
    }

    if (itemId === expectedItemId) {
      if (activeStep?.expectedIntent === "MISSION_COMPLETE") {
        setGameState("completed");
        setFeedbackMessage(
          activeStep.successResponse ||
            activeStep.buddyMessage ||
            "Mission complete.",
        );
        setShowRewards(true);
        return;
      }

      if (
        itemId === EGG_ON_TOAST_ID ||
        itemId === itemsByWord.milk?.id ||
        itemId === itemsByWord.apple?.id
      ) {
        const isFinalFoodStep =
          nextStep?.expectedIntent === "MISSION_COMPLETE" || !nextStep;
        setMissionStage((prev) => prev + 1);
        setFeedbackMessage(
          nextStep?.buddyMessage ||
            activeStep?.successResponse ||
            `${word} is correct.`,
        );
        removeItem(itemId);
        if (itemId === itemsByWord.milk?.id && itemsByWord.apple) {
          setTableItems((prev) => prev.concat(itemsByWord.apple));
        }
        if (isFinalFoodStep) {
          setGameState("completed");
          setFeedbackMessage(
            nextStep?.successResponse ||
              activeStep?.successResponse ||
              "Mission complete.",
          );
          setXp((prev) => prev + 20);
          setCoins((prev) => prev + 10);
          setShowRewards(true);
        }
      }
      return;
    }

    setFeedbackMessage(
      activeStep?.failResponse ||
        `${word} is not the item Buddy needs right now.`,
    );
  };

const handleCombineItems = (draggedId, targetId) => {
  if (gameState !== "idle-at-table") return false;

  if (preparedEggOnToast) {
    setFeedbackMessage("You already cooked Egg on Toast.");
    return false;
  }

  const pair = new Set([draggedId, targetId]);

  if (!pair.has(BREAD_ID) || !pair.has(EGG_ID)) {
    setFeedbackMessage("Try combining Bread and Egg.");
    return false;
  }

  setPreparedEggOnToast(true);

  setTableItems((prev) => [
    ...prev.filter((item) => item.id !== BREAD_ID && item.id !== EGG_ID),
    itemsByWord.eggOnToast,
  ]);

  setFeedbackMessage("Egg on Toast is ready.");

  return true;
};

const handleDropOnPot = (itemId) => {
  if (gameState !== "idle-at-table") return false;

  if (itemId !== BREAD_ID && itemId !== EGG_ID) {
    setFeedbackMessage("Only Bread and Egg can go into the pot.");
    return false;
  }

  if (potContents.includes(itemId)) {
    setFeedbackMessage("That item is already in the pot.");
    return false;
  }

  const nextContents = [...potContents, itemId];

  setPotContents(nextContents);

  removeItem(itemId);

  if (
    nextContents.includes(BREAD_ID) &&
    nextContents.includes(EGG_ID)
  ) {
    setPreparedEggOnToast(true);

    setPotContents([]);

    setTableItems((prev) => [
      ...prev,
      itemsByWord.eggOnToast,
    ]);

    setFeedbackMessage("Egg on Toast is ready. Drag it to Buddy.");

    return true;
  }

  setFeedbackMessage("Great! Add the other ingredient.");

  return true;
};

  const getMissionInstruction = () => {
    if (scenarioLoading || vocabularyLoading || stepsLoading)
      return "Loading mission data...";
    if (scenarioError || vocabularyError || stepsError)
      return scenarioError || vocabularyError || stepsError;
    if (!scenarioId) return "Choose a scenario from Food Forest to begin.";
    if (gameState === "not-started")
      return scenario?.description || "Click 'Start Mission' to begin.";
    if (gameState === "walking-to-table")
      return "Buddy is walking to the table...";
    if (gameState === "idle-at-table")
      return activeStep?.buddyMessage || "Complete the current mission step.";
    return "Mission complete. Buddy is happy and full.";
  };

  const handleBuddyPointerDown = (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDraggingBuddy(true);
    buddyDragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      left: parseFloat(buddyPosition.left),
      top: parseFloat(buddyPosition.top),
    };
  };

  const handleBuddyPointerMove = (e) => {
    if (!isDraggingBuddy) return;
    const deltaX = e.clientX - buddyDragStartRef.current.x;
    const deltaY = e.clientY - buddyDragStartRef.current.y;
    const left = Math.min(
      90,
      Math.max(
        10,
        buddyDragStartRef.current.left + (deltaX / window.innerWidth) * 100,
      ),
    );
    const top = Math.min(
      85,
      Math.max(
        15,
        buddyDragStartRef.current.top + (deltaY / window.innerHeight) * 100,
      ),
    );
    setBuddyPosition({ left: `${left}%`, top: `${top}%` });
  };

  const handleBuddyPointerUp = (e) => {
    if (!isDraggingBuddy) return;
    setIsDraggingBuddy(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const buddy3DPosition = [
    (parseFloat(buddyPosition.left) - 47) / 10,
    -1.8 + (50 - parseFloat(buddyPosition.top)) / 10,
    0,
  ];

  const startDisabled =
    scenarioLoading ||
    vocabularyLoading ||
    stepsLoading ||
    !scenarioId ||
    initialTableItems.length === 0 ||
    scenarioSteps.length === 0;
  const visibleTableItems =
    gameState === "not-started" ? initialTableItems : tableItems;

  return (
    <div className="kitchen-adv-container">
      <AdventureScene
        gameState={gameState}
        onArrivedAtTable={handleArrivedAtTable}
        buddyPosition={buddy3DPosition}
      />

      {gameState === "idle-at-table" && (
        <>
          <div className="pot-drop-zone" aria-label="Pot area">
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
        {visibleTableItems.map((item, index) => (
          <DraggableItem
            key={item.id}
            item={item}
            position={ITEM_POSITIONS[index % ITEM_POSITIONS.length]}
            onDropOnBuddy={handleDropOnBuddy}
            onDropOnItem={handleCombineItems}
            onDropOnPot={handleDropOnPot}
            disabled={gameState !== "idle-at-table"}
          />
        ))}
      </div>

      <header className="hud-header">
        <div className="hud-title-container">
          <span className="hud-title-forest">
            {scenario?.worldName || "Food Forest"}
          </span>
          <span className="hud-title-level">
            {scenario?.title || "Kitchen Adventure"}
          </span>
        </div>

        <div className="hud-stats-container">
          <div className="stat-card">
            <span>XP: {xp}</span>
          </div>
          <div className="stat-card">
            <span>Coins: {coins}</span>
          </div>
        </div>
      </header>

      <div className="mission-panel-toggle-wrapper">
        <button
          className="mission-toggle-btn"
          onClick={() => setMissionPanelVisible((prev) => !prev)}
          type="button"
        >
          {missionPanelVisible ? "Hide Mission Panel" : "Show Mission Panel"}
        </button>
      </div>

      {missionPanelVisible && (
        <MissionPanel
          gameState={gameState}
          title={scenario?.title}
          description={scenario?.description}
          onStartMission={handleStartMission}
          instruction={getMissionInstruction()}
          loading={scenarioLoading || vocabularyLoading || stepsLoading}
          error={scenarioError || vocabularyError || stepsError}
          startDisabled={startDisabled}
        />
      )}

      {/* <div className="mic-button-wrapper">
        <button
          className={`mic-btn ${isListening ? "active-listening" : ""}`}
          onClick={() => setIsListening((prev) => !prev)}
          aria-label="Microphone"
          type="button"
        >
          Mic
        </button>
      </div> */}

      <button
        className="back-to-map-btn"
        onClick={() => navigate("/adventure/food-forest")}
        type="button"
      >
        Back to Map
      </button>

      {gameState !== "not-started" && (
        <SpeechBubble
          gameState={gameState}
          message={feedbackMessage}
          buddyPosition={buddyPosition}
          scenarioDescription={
            activeStep?.buddyMessage || scenario?.description
          }
        />
      )}

      <RewardPopup
        show={showRewards}
        xpReward={20}
        coinReward={10}
        onClose={() => setShowRewards(false)}
      />
    </div>
  );
}
