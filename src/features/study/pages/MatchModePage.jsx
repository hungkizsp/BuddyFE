import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/authStore';
import useStudySession from '../hooks/useStudySession';
import StudyProgressBar from '../components/StudyProgressBar';
import StudyResult from '../components/StudyResult';

export default function MatchModePage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { childProfile } = useAuthStore();
  const childId = childProfile?.id;

  const {
    loading,
    error,
    vocabularies,
    results,
    isFinished,
    startSession,
    submitAnswer,
    finishSession,
  } = useStudySession(childId, categoryId, 'MATCH');

  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [matchedIds, setMatchedIds] = useState(new Set());
  const [wrongCardIds, setWrongCardIds] = useState([]);
  
  // Timer state
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const timerRef = useRef(null);

  // Initialize study session
  useEffect(() => {
    startSession();
  }, [startSession]);

  // Set up game board once vocabulary list loads
  useEffect(() => {
    if (vocabularies.length === 0) return;

    // Pick maximum 6 random words for the game
    const selectedVocabs = [...vocabularies]
      .sort(() => 0.5 - Math.random())
      .slice(0, 6);

    const gameCards = [];
    selectedVocabs.forEach((vocab) => {
      // Word Card
      gameCards.push({
        id: `word-${vocab.id}`,
        matchId: vocab.id,
        type: 'word',
        text: vocab.word,
      });
      // Meaning Card
      gameCards.push({
        id: `mean-${vocab.id}`,
        matchId: vocab.id,
        type: 'meaning',
        text: vocab.meaning,
      });
    });

    // Shuffle cards
    setCards(gameCards.sort(() => 0.5 - Math.random()));
    setMatchedIds(new Set());
    setSelectedCard(null);
    setWrongCardIds([]);
    setTimeElapsed(0);
    setGameStarted(true);

    // Start Timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [vocabularies]);

  const handleCardClick = async (card) => {
    // Ignore clicked if already matched, or currently flashing wrong
    if (matchedIds.has(card.matchId) || wrongCardIds.includes(card.id)) return;

    // First card selected
    if (!selectedCard) {
      setSelectedCard(card);
      return;
    }

    // Ignore clicking the same card
    if (selectedCard.id === card.id) {
      setSelectedCard(null);
      return;
    }

    // Clicked second card
    if (selectedCard.matchId === card.matchId) {
      // MATCH SUCCESS!
      const newMatched = new Set(matchedIds);
      newMatched.add(card.matchId);
      setMatchedIds(newMatched);
      setSelectedCard(null);

      // Record correct answer on backend
      await submitAnswer(card.matchId, true, 0);

      // Check if game finished
      const totalPairs = cards.length / 2;
      if (newMatched.size === totalPairs) {
        clearInterval(timerRef.current);
        await finishSession();
      }
    } else {
      // MATCH FAILED!
      setWrongCardIds([selectedCard.id, card.id]);
      setSelectedCard(null);

      // Record wrong answer on backend
      await submitAnswer(card.matchId, false, 0);

      // Flash red, then clear selection
      setTimeout(() => {
        setWrongCardIds([]);
      }, 1000);
    }
  };

  const handleExit = () => {
    navigate('/study');
  };

  if (loading && cards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy text-cream">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-sm uppercase tracking-wider text-cream/40">Creating Match Board...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy text-cream px-6">
        <div className="text-center max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-glass">
          <span className="text-4xl">⚠️</span>
          <h2 className="font-grotesk text-xl font-bold mt-4 mb-2">Failed to start Match</h2>
          <p className="text-sm text-cream/60 font-nunito mb-6">{error}</p>
          <button
            onClick={() => navigate('/study')}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-blue-600 font-grotesk font-semibold text-white transition-all shadow-glow"
          >
            Back to Study Hub
          </button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-navy text-cream py-12 px-6">
        <StudyResult results={results} modeName="Match" onRetry={startSession} onReviewWeakWords={startSession} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy text-cream flex flex-col">
      {/* Header */}
      <StudyProgressBar
        current={matchedIds.size}
        total={cards.length / 2}
        modeName="Match"
        onExit={handleExit}
      />

      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 max-w-4xl mx-auto w-full select-none">
        {/* Game stats */}
        <div className="w-full flex justify-between items-center mb-8 bg-slate-900/60 border border-slate-800 rounded-2xl px-6 py-4 shadow-soft">
          <span className="font-mono text-xs uppercase tracking-widest text-cream/40">
            Click cards to match words with meanings
          </span>
          <div className="font-mono font-bold text-lg text-accent">
            ⏱️ {timeElapsed}s
          </div>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
          {cards.map((card) => {
            const isMatched = matchedIds.has(card.matchId);
            const isSelected = selectedCard?.id === card.id;
            const isWrong = wrongCardIds.includes(card.id);

            let cardStyles = 'bg-slate-900/90 border-slate-800 text-cream hover:border-slate-700';
            if (isSelected) {
              cardStyles = 'bg-primary/20 border-primary text-primary shadow-glow scale-[1.02]';
            } else if (isWrong) {
              cardStyles = 'bg-danger/20 border-danger text-danger animate-pulse';
            } else if (isMatched) {
              cardStyles = 'opacity-0 pointer-events-none scale-90 transition-all duration-500';
            }

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className={`h-28 rounded-2xl border-2 flex items-center justify-center p-4 text-center cursor-pointer font-grotesk font-semibold text-sm md:text-base leading-relaxed transition-all duration-300 ${cardStyles}`}
              >
                <span className="capitalize">{card.text}</span>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
