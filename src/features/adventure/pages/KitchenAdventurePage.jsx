import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import AdventureScene from "../components/AdventureScene";
import DraggableItem from "../components/DraggableItem";
import SpeechBubble from "../components/SpeechBubble";
import MissionPanel from "../components/MissionPanel";
import RewardPopup from "../components/RewardPopup";
import FruitBasketPopup from "../components/FruitBasketPopup";
import BackgroundMusic from "../components/BackgroundMusic";
import LandscapeOverlay from "../components/LandscapeOverlay";
import useAdventureOrientation from "../hooks/useAdventureOrientation";
import bgMusicSrc from "../../../assets/Music/After_the_Boss_Fight.mp3";
import useScenarioSteps from "../hooks/useScenarioSteps";
import useScenarioVocabulary from "../hooks/useScenarioVocabulary";
import learningService from "../services/learningService";
import profileService from "../services/profileService";
import progressService from "../services/progressService";
import { useAuthStore } from "../../auth/store/authStore";
import "../styles/KitchenAdventurePage.css";
import fruitBasketImg from "../../../assets/fruit-basket.png";

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
  { left: "18%", top: "20%" },
  { left: "36%", top: "10%" },
  { left: "44%", top: "12%" },
  { left: "64%", top: "60%" },
  { left: "47%", top: "48%" },
  { left: "74%", top: "60%" },
];

const findVocabulary = (items, ...expectedWords) =>
  items.find((item) => {
    const itemId = normalizeWord(item.id || item.label || "");
    return expectedWords.some((w) => normalizeWord(w) === itemId);
  });

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
  const [bollyPosition, setBollyPosition] = useState({
    left: "67%",
    top: "47%",
  });
  const [isDraggingBolly, setIsDraggingBolly] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [missionPanelVisible, setMissionPanelVisible] = useState(true);
  const [xp, setXp] = useState(60);
  const [coins, setCoins] = useState(15);
  const [showRewards, setShowRewards] = useState(false);
  const [showFruitBasket, setShowFruitBasket] = useState(false);
  const [hasAppleFromBasket, setHasAppleFromBasket] = useState(false);
  const { childProfile, loadChildProfile } = useAuthStore();
  const bollyDragStartRef = useRef({ x: 0, y: 0, left: 0, top: 0 });
  const containerRef = useRef(null);
  const { isMobile, isPortrait, isFullscreen, requestFullscreen, exitFullscreen } =
    useAdventureOrientation(containerRef);

  // Auto-enter fullscreen when the game page mounts on a mobile device
  useEffect(() => {
    if (isMobile) {
      requestFullscreen();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  useEffect(() => {
    if (!showRewards || !childProfile?.id || !scenarioId) return;

    const completeAndReward = async () => {
      try {
        const vocabIds = vocabularies.map((v) => v.vocabularyId).filter(Boolean);
        const progressRes = await progressService.completeScenario({
          childId: childProfile.id,
          scenarioId: parseInt(scenarioId, 10),
          score: 100, // standard complete score
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
          // Zero rewards out if already completed so the pop-up shows 0 rewards correctly.
          setXp(0);
          setCoins(0);
        }
      } catch (err) {
        console.error("Failed to complete scenario or update profile:", err);
      }
    };

    completeAndReward();
  }, [showRewards]);

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
          setScenarioError(err.message || "Không thể tải kịch bản.");
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
      eggOnToast: findVocabulary(
        vocabularyItems,
        "egg sandwich",
        "egg-sandwich",
        "egg on toast",
        "egg-on-toast"
      ),
    }),
    [vocabularyItems],
  );

  const eggDishItem = useMemo(() => {
    if (itemsByWord.eggOnToast) return itemsByWord.eggOnToast;
    return {
      id: "egg-sandwich",
      label: "Egg Sandwich",
      meaning: "Bánh mì kẹp trứng",
      image: resolveVocabularyImage("/images/vocabulary/egg-sandwich.png"),
      alt: "Egg Sandwich",
      exampleSentence: "Bolly is eating an egg sandwich.",
      vocabulary: null,
    };
  }, [itemsByWord.eggOnToast]);

  const BREAD_ID = "bread";
  const EGG_ID = "egg";
  const EGG_ON_TOAST_ID = eggDishItem.id;
  const activeStep = scenarioSteps[missionStage];
  const nextStep = scenarioSteps[missionStage + 1];

  const initialTableItems = useMemo(
    () =>
      vocabularyItems.filter((item) => {
        const id = normalizeWord(item.label || item.id || "");
        const isExcluded =
          ["apple", "orange", "pear", "grapes", "egg-on-toast", "egg-sandwich"].includes(id) ||
          id === eggDishItem.id;

        return !isExcluded;
      }),
    [vocabularyItems, eggDishItem],
  );

  const getFruitImage = (filename) =>
    resolveVocabularyImage(filename) || fruitBasketImg;

  const basketItems = useMemo(
    () => [
      {
        id: "apple",
        name: "Apple",
        image: getFruitImage("apple.png"),
      },
      {
        id: "banana",
        name: "Banana",
        image: getFruitImage("banana.png"),
      },
      {
        id: "orange",
        name: "Orange",
        image: getFruitImage("oranges.png"),
      },
      {
        id: "pear",
        name: "Pear",
        image: getFruitImage("pear.png"),
      },
      {
        id: "grapes",
        name: "Grapes",
        image: getFruitImage("grapes.png"),
      },
    ],
    [],
  );

  const resetMission = () => {
    setTableItems(initialTableItems);
    setMissionStage(0);
    setPreparedEggOnToast(false);
    setPotContents([]);
    setHasAppleFromBasket(false);
    setShowFruitBasket(false);
    setBollyPosition({ left: "67%", top: "47%" });
    setFeedbackMessage(
      scenarioSteps[0]?.bollyMessage ||
      scenario?.description ||
      "Bolly đã sẵn sàng cho nhiệm vụ này.",
    );
    setShowRewards(false);
  };

  const handleStartMission = () => {
    if (gameState === "not-started" && initialTableItems.length > 0) {
      resetMission();
      setGameState("walking-to-table");
      setFeedbackMessage(
        scenarioSteps[0]?.bollyMessage ||
        scenario?.description ||
        "Bolly đang đi đến bàn bếp.",
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

  const handleSelectFruit = (fruitId) => {
    setShowFruitBasket(false);

    if (fruitId === "apple") {
      if (!hasAppleFromBasket) {
        setHasAppleFromBasket(true);
        setTableItems((prev) => {
          const appleItem = vocabularyItems.find(
            (item) => normalizeWord(item.label) === "apple",
          );
          if (!appleItem) return prev;
          return prev.some((item) => item.id === appleItem.id)
            ? prev
            : [...prev, appleItem];
        });
        setFeedbackMessage("Tuyệt vời! Apple đúng là thứ mình muốn.");
      }
      return;
    }

    const fruitReplies = {
      banana: "Đó là banana, nó ngon đấy nhưng hôm nay mình muốn một quả Apple.",
      orange: "Hmm hình như đó là Orange, nó rất tươi mát nhưng mình đang thèm một quả Apple.",
      pear: "Ồ, đó là Pear! Ngọt lắm đấy, nhưng hôm nay mình muốn có một quả Apple.",
      grapes: "Wow, Grapes nhìn hấp dẫn ghê! Nhưng hôm nay mình chỉ muốn một quả Apple thôi."
    };

    setFeedbackMessage(
      fruitReplies[fruitId] || "Hôm nay mình muốn một quả Apple hơn.",
    );
  };

  const handleDropOnBolly = (itemId) => {
    if (gameState !== "idle-at-table") return;

    const item = tableItems.find((tableItem) => tableItem?.id === itemId);
    const word = item?.label || itemId;
    const expectedItemId = entityToItemId(activeStep?.expectedEntity);

    if (itemId === BREAD_ID || itemId === EGG_ID) {
      setFeedbackMessage(
        activeStep?.failResponse ||
        `Bolly muốn ${eggDishItem.label || "món đã chuẩn bị"}, không chỉ mỗi ${word}.`,
      );
      return;
    }

    const isEggDishMatch =
      (itemId === "egg-sandwich" || itemId === "egg-on-toast" || itemId === eggDishItem.id) &&
      (expectedItemId === "egg-sandwich" || expectedItemId === "egg-on-toast");

    if (itemId === expectedItemId || isEggDishMatch) {
      if (activeStep?.expectedIntent === "MISSION_COMPLETE") {
        setGameState("completed");
        setFeedbackMessage(
          activeStep.successResponse ||
          activeStep.bollyMessage ||
          "Hoàn thành nhiệm vụ.",
        );
        setShowRewards(true);
        return;
      }

      if (
        itemId === EGG_ON_TOAST_ID ||
        itemId === eggDishItem.id ||
        itemId === "egg-sandwich" ||
        itemId === "egg-on-toast" ||
        itemId === itemsByWord.milk?.id ||
        itemId === itemsByWord.apple?.id
      ) {
        const isFinalFoodStep =
          nextStep?.expectedIntent === "MISSION_COMPLETE" || !nextStep;
        setMissionStage((prev) => prev + 1);

        if (itemId === itemsByWord.milk?.id) {
          setFeedbackMessage(
            "Tuyệt vời! Hãy mở Giỏ trái cây và tìm một quả Apple.",
          );
        } else {
          setFeedbackMessage(
            nextStep?.bollyMessage || activeStep?.successResponse,
          );
        }
        removeItem(itemId);
        if (isFinalFoodStep) {
          setGameState("completed");
          setFeedbackMessage(
            nextStep?.successResponse ||
            activeStep?.successResponse ||
            "Hoàn thành nhiệm vụ.",
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
      `${word} không phải là thứ Bolly cần lúc này.`,
    );
  };

  const handleCombineItems = (draggedId, targetId) => {
    if (gameState !== "idle-at-table") return false;

    if (preparedEggOnToast) {
      setFeedbackMessage(`Bạn đã nấu ${eggDishItem.label} rồi.`);
      return false;
    }

    const pair = new Set([draggedId, targetId]);

    if (!pair.has(BREAD_ID) || !pair.has(EGG_ID)) {
      setFeedbackMessage("Hãy thử kết hợp Bread và Egg.");
      return false;
    }

    setPreparedEggOnToast(true);

    setTableItems((prev) => [
      ...prev.filter((item) => item?.id !== BREAD_ID && item?.id !== EGG_ID),
      eggDishItem,
    ]);

    setFeedbackMessage(`${eggDishItem.label} đã sẵn sàng.`);

    return true;
  };

  const handleDropOnPot = (itemId) => {
    if (gameState !== "idle-at-table") return false;

    if (itemId !== BREAD_ID && itemId !== EGG_ID) {
      setFeedbackMessage("Chỉ Bread và Egg mới có thể cho vào nồi.");
      return false;
    }

    if (potContents.includes(itemId)) {
      setFeedbackMessage("Món đó đã ở trong nồi rồi.");
      return false;
    }

    const nextContents = [...potContents, itemId];

    setPotContents(nextContents);

    removeItem(itemId);

    if (nextContents.includes(BREAD_ID) && nextContents.includes(EGG_ID)) {
      setPreparedEggOnToast(true);

      setPotContents([]);

      setTableItems((prev) => [...prev, eggDishItem]);

      setFeedbackMessage(`${eggDishItem.label} đã sẵn sàng. Kéo nó đến chỗ Bolly.`);

      return true;
    }

    setFeedbackMessage("Tuyệt! Thêm nguyên liệu còn lại nào.");

    return true;
  };

  const getMissionInstruction = () => {
    if (scenarioLoading || vocabularyLoading || stepsLoading)
      return "Đang tải dữ liệu nhiệm vụ...";
    if (scenarioError || vocabularyError || stepsError)
      return scenarioError || vocabularyError || stepsError;
    if (!scenarioId) return "Chọn một kịch bản từ Food Forest để bắt đầu.";
    if (gameState === "not-started")
      return scenario?.description || "Nhấn 'Bắt đầu nhiệm vụ' để bắt đầu.";
    if (gameState === "walking-to-table")
      return "Bolly đang đi đến bàn...";
    if (gameState === "idle-at-table")
      return activeStep?.bollyMessage || "Hoàn thành bước nhiệm vụ hiện tại.";
    return "Hoàn thành nhiệm vụ. Bolly rất vui và no bụng.";
  };

  const handleBollyPointerDown = (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDraggingBolly(true);
    bollyDragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      left: parseFloat(bollyPosition.left),
      top: parseFloat(bollyPosition.top),
    };
  };

  const handleBollyPointerMove = (e) => {
    if (!isDraggingBolly) return;
    const deltaX = e.clientX - bollyDragStartRef.current.x;
    const deltaY = e.clientY - bollyDragStartRef.current.y;
    const left = Math.min(
      90,
      Math.max(
        10,
        bollyDragStartRef.current.left + (deltaX / window.innerWidth) * 100,
      ),
    );
    const top = Math.min(
      85,
      Math.max(
        15,
        bollyDragStartRef.current.top + (deltaY / window.innerHeight) * 100,
      ),
    );
    setBollyPosition({ left: `${left}%`, top: `${top}%` });
  };

  const handleBollyPointerUp = (e) => {
    if (!isDraggingBolly) return;
    setIsDraggingBolly(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const bolly3DPosition = [
    (parseFloat(bollyPosition.left) - 47) / 10,
    -1.8 + (50 - parseFloat(bollyPosition.top)) / 10,
    0,
  ];

  const startDisabled =
    scenarioLoading ||
    vocabularyLoading ||
    stepsLoading ||
    !scenarioId ||
    initialTableItems.length === 0 ||
    scenarioSteps.length === 0;
  const visibleTableItems = (
    gameState === "not-started" ? initialTableItems : tableItems
  ).filter(Boolean);

  const canOpenBasket = activeStep?.expectedEntity === "APPLE";
  return (
    <div ref={containerRef} className="kitchen-adv-container app-shell">
      <LandscapeOverlay
        isMobile={isMobile}
        isPortrait={isPortrait}
        isFullscreen={isFullscreen}
        onRequestFullscreen={requestFullscreen}
        onExitFullscreen={exitFullscreen}
      />
      <BackgroundMusic src={bgMusicSrc} volume={0.2} />
      <AdventureScene
        gameState={gameState}
        onArrivedAtTable={handleArrivedAtTable}
        bollyPosition={bolly3DPosition}
      />

      <button
        className="fruit-basket-drop-zone"
        disabled={!canOpenBasket}
        onClick={() => {
          if (!canOpenBasket) {
            setFeedbackMessage("Bolly chưa yêu cầu trái cây.");
            return;
          }

          setShowFruitBasket(true);
        }}
      >
        <span>Giỏ trái cây</span>
        <img src={fruitBasketImg} alt="Giỏ trái cây" />
      </button>

      {gameState === "idle-at-table" && (
        <>
          <div className="pot-drop-zone" aria-label="Pot area">
            <span>Nồi</span>
          </div>
          <div
            className="bolly-drop-target"
            style={{ left: bollyPosition.left, top: bollyPosition.top }}
          />
          <button
            className="bolly-drag-handle"
            style={{ left: bollyPosition.left, top: bollyPosition.top }}
            onPointerDown={handleBollyPointerDown}
            onPointerMove={handleBollyPointerMove}
            onPointerUp={handleBollyPointerUp}
            onPointerCancel={handleBollyPointerUp}
            type="button"
          >
            Kéo Bolly
          </button>
        </>
      )}

      <div className="kitchen-table-items">
        {visibleTableItems.map((item, index) => (
          <DraggableItem
            key={item.id}
            item={item}
            position={ITEM_POSITIONS[index % ITEM_POSITIONS.length]}
            onDropOnBolly={handleDropOnBolly}
            onDropOnItem={handleCombineItems}
            onDropOnPot={handleDropOnPot}
            disabled={gameState !== "idle-at-table"}
          />
        ))}
      </div>

      <header className="hud-header">
        <div className="hud-title-container">
          <span className="hud-title-forest">
            {scenario?.worldName === 'Food Forest' ? 'Khu Rừng Thức Ăn' : (scenario?.worldName || 'Khu Rừng Thức Ăn')}
          </span>
          <span className="hud-title-level">
            {scenario?.title === 'Breakfast Trouble' ? 'Bữa Sáng Rắc Rối' : (scenario?.title || 'Phiêu lưu nhà bếp')}
          </span>
        </div>

        <div className="hud-stats-container">
          <div className="stat-card">
            <span>XP: {xp}</span>
          </div>
          <div className="stat-card">
            <span>Xu: {coins}</span>
          </div>
        </div>
      </header>

      <div className="mission-panel-toggle-wrapper">
        <button
          className="mission-toggle-btn"
          onClick={() => setMissionPanelVisible((prev) => !prev)}
          type="button"
        >
          {missionPanelVisible ? "Ẩn bảng nhiệm vụ" : "Hiện bảng nhiệm vụ"}
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

      <button
        className="back-to-map-btn"
        onClick={() => navigate("/adventure/food-forest")}
        type="button"
      >
        Quay lại bản đồ
      </button>

      {gameState !== "not-started" && (
        <SpeechBubble
          gameState={gameState}
          message={feedbackMessage}
          bollyPosition={bollyPosition}
          scenarioDescription={
            activeStep?.bollyMessage || scenario?.description
          }
        />
      )}

      <RewardPopup
        show={showRewards}
        xpReward={20}
        coinReward={10}
        onClose={() => {
          setShowRewards(false);
          navigate("/adventure/food-forest");
        }}
      />

      <FruitBasketPopup
        show={showFruitBasket}
        fruits={
          hasAppleFromBasket
            ? basketItems.filter((fruit) => fruit.id !== "apple")
            : basketItems
        }
        onClose={() => setShowFruitBasket(false)}
        onSelectFruit={handleSelectFruit}
      />
    </div>
  );
}
